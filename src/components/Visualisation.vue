<template>
  <div id="visualisation" class="container"></div>
</template>

<script>
import d3 from 'd3'

export default {
  name: 'visualisation',
  data () {
    return {}
  },
  created () {
    this.$store.dispatch('getData')
  },
  mounted () {
    var diameter = this.$el.parentNode.offsetWidth / 2,
      radius = diameter / 2,
      innerRadius = radius - 180;
    this.cluster = d3.layout.cluster()
      .size([360, innerRadius])
      .sort(null);
    this.bundle = d3.layout.bundle();
    this.line = d3.svg.line.radial()
      .interpolate('bundle')
      .tension(.85)
      .radius(function (d) { return d.y; })
      .angle(function (d) { return d.x / 180 * Math.PI })
    this.svg = d3.select(this.$el).append('svg')
      .attr('width', diameter)
      .attr('height', diameter)
      .append('g')
      .attr('transform', 'translate(' + radius + ',' + radius + ')');
  },
  methods: {
    groupHierarchy: function (groups) {
      var map = {};
      var root = {name: '', children: []};
      function find(name, data) {
        var node = map[name];
        if (!node) {
          node = map[name] = data || {name: name, children: []};
          node.parent = root;
          node.parent.children.push(node);
        }
        return node;
      }
      groups.forEach(function (d) { find(d.name, d); });
      groups.forEach(function (d) {
        d.ingress.forEach(function (i) { find(i.name); });
      });
      return root;
    },
    makeLinks: function (nodes) {
      var map = {},
        links = [];
      // Map IDs/Names to SGs
      nodes.forEach(function (n) {
        map[n.name] = n;
      });
      // Create links between SGs
      nodes.forEach(function (n) {
        if (n.ingress) {
          n.ingress.forEach(function (i) {
            links.push({source: map[i.name], target: map[n.name]});
          })
        }
      });
      return links;
    }
  },
  watch: {
    '$store.state.data': function () {
      console.log('data changed!')
      const securityGroups = this.$store.state.data
      var nodes = this.cluster.nodes(this.groupHierarchy(securityGroups)),
        links = this.makeLinks(nodes);

      var link = this.svg.append('g').selectAll('.link'),
        node = this.svg.append('g').selectAll('.node');


      // Highlights inbound/outbound links.
      var mouseover = function (d) {
        node.each(function (n) { n.target = n.source = false; });
        link
          .classed('link--target', function (l) {
            if (l.target === d) { return l.source.source = true; }
          })
          .classed('link--source', function (l) {
            if (l.source === d) { return l.target.target = true; }
          });
        node
          .classed('node--target', function (n) { return n.target; })
          .classed('node--source', function (n) { return n.source; })
      }
      // Resets any highlighted links.
      var mouseout = function (d) {
        link
          .classed('link--target', false)
          .classed('link--source', false);
        node
          .classed('node--target', false)
          .classed('node--source', false);
      }



      link = link.data(this.bundle(links))
        .enter()
        .append('path')
        .each(function (d) { return d.source = d[0], d.target = d[d.length - 1]; })
        .attr('class', 'link')
        .attr('d', this.line);
      var node = this.svg.selectAll('g.node')
        .data(nodes.filter(function (n) { return !n.children; }))
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return `rotate(${d.x - 90})translate(${d.y})`;
        });
      node.append('text')
        .attr('class', 'node')
        .attr('dy', '0.31em')
        .attr('dx', function (d) {
          return d.x < 180 ? '0.31em' : '-0.31em';
        })
        .attr('transform', function (d) {
          return d.x < 180 ? '' : 'rotate(180)';
        })
        .style('text-anchor', function(d) {
          return d.x < 180 ? 'start' : 'end';
        })
        .text(function (d) { return d.name; })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);
    }
  },
}
</script>

<style>
  .node {
    font: 300 11px "Helvetica Neue", Helvetica, Arial, sans-serif;
    fill: #000;
  }
  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 1px;
  }
  .node:hover {
    fill: #000;
  }
  .link {
    stroke: steelblue;
    stroke-opacity: .4;
    fill: none;
    pointer-events: none;
  }
  .node:hover,
  .node--source,
  .node--target {
    font-weight: 700;
  }
  .node--source {
    fill: #2ca02c;
  }
  .node--target {
    fill: #d62728;
  }
  .link--source,
  .link--target {
    stroke-opacity: 1;
    stroke-width: 2px;
  }
  .link--source {
    stroke: #d62728;
  }
  .link--target {
    stroke: #2ca02c;
  }
</style>
