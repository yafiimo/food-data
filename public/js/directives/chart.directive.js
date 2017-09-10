function myChart($window) {
  return {
    restrict: 'E',
    replace: false,
    // scope.data is given the value of whatever you put in values="" in the html
    scope: {
      data: '=',
      chartData: '=',
      domain: '='
    },
    link: function(scope, element) {
      const d3 = $window.d3;
      const height = 350;
      const width = 300;

      const yScale = d3.scaleLog()
      .range([0, height])
      .domain([0.1, scope.domain]);

      const xScale = d3.scaleBand()
        .domain(d3.range(scope.chartData.length))
        .rangeRound([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

      const colours1 = d3.scaleLinear()
        .domain([0, scope.chartData.length])
        .range(['red', 'yellow']);
      const colours2 = d3.scaleLinear()
        .domain([0, scope.chartData.length])
        .range(['green', 'yellow']);

      const tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('background', '#f4f4f4')
        .style('padding', '5px 15px')
        .style('border', '1px solid grey')
        .style('border-radius', '5px')
        .style('opacity', 0);

      const chart = $window.d3.select(element[0])
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'rgba(0,0,0, 0.8)')
        .style('border', '1px solid white')
        .selectAll('rect')
        .data(scope.data)
        .enter().append('rect')
        .style('fill', (data, index) => {
          if(data.unit === 'g') {
            return colours1(index);
          } else {
            return colours2(index);
          }
        })
        .attr('stroke', 'black')
        .attr('stoke-width', 2)
        .attr('height', 0)
        .attr('width', xScale.bandwidth())
        .attr('x', (data, index) => xScale(index))
        .attr('y', height)
        .text((data) => data.nutrient)
        .on('mouseover', (data) => {
          tooltip.transition()
            .style('opacity', 1);
          tooltip.html(data.gm + data.unit)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px');
        });

      d3.select('#proximates svg')
        .enter().style('fill', (data, index) => colours(index));


      chart.transition()
          .attr('height', (data) => {
            if(data.gm > 1) return yScale(data.gm);
            return data.gm * 150;
          })
          .attr('y', (data) => {
            if(data.gm > 1) return height - yScale(data.gm);
            return height - (data.gm * 150);
          })
          .duration(900)
          .delay((data, index) => index * 30)
          .ease(d3.easeElastic);

      // Proximates Axes
        //Vertical Axis
      const proxVScale = d3.scaleLog()
        .range([height, 0])
        .domain([0.1, 100]);

      const proxVAxis = d3.axisLeft(proxVScale)
        .tickFormat(d3.format('.1f'))
        .tickValues([1,5,20,100]);

      d3.select('#proximates svg')
        .append('g')
        .attr('transform', 'translate(35, 0)')
        .call(proxVAxis);

        // Horizontal Axis
      const proxHScale = d3.scaleBand()
        .domain(d3.range(scope.chartData.length))
        .rangeRound([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

      // Minerals Axes
        // Vertical Axis
      const minVScale = d3.scaleLog()
        .range([height, 0])
        .domain([0.1, 2000]);

      const minVAxis = d3.axisLeft(minVScale)
        .tickFormat(d3.format('.1f'))
        .tickValues([1,3,10,30,100,500,2000]);

      d3.select('#minerals svg')
        .append('g')
        .attr('transform', 'translate(40, 0)')
        .call(minVAxis);

        // Horizontal Axis
      const minHScale = d3.scaleBand()
        .domain(d3.range(scope.chartData.length))
        .rangeRound([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

      d3.selectAll('svg')
      .selectAll('path')
        .style('stroke', 'white');

      d3.selectAll('svg')
      .selectAll('line')
        .style('stroke', 'white');
    }
  };
}


angular.module('nutri-data')
  .directive('myChart', myChart);
