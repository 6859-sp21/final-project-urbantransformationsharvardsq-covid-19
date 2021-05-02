 //Append the legend
    var size = 12;  
    
    var legend = d3.select("#time_container").append(":svg")
        .data([1,2,3,4,5,6,7])
        .enter()
        .append('g')
        .attr('class', 'legend')
        .append("rect")
          .attr("x", function(d,i){ return 250 + i*(size+50)})
          .attr("y", 430) // 430 is where the first rect appears. 
          .attr("width", size)
          .attr("height", size)
          .style("fill", "black");;
    
 
        // .attr('id',function(d){ return selector.slice(1)+ "GDP"+"-" + d.key; })
        // .on('click', function (d) {                           //onclick function to toggle off the lines          
        //   if($(this).css("opacity") == 1){          //uses the opacity of the item clicked on to determine whether to turn the line on or off         
             
        //     var elemented = document.getElementById(this.id +"-line");   //grab the line that has the same ID as this point along w/ "-line"  use get element cause ID has spaces
        //     d3.select(elemented)
        //       .transition()
        //       .duration(200)
        //       .style("opacity",0)
        //       .style("display",'none');
          
        //     d3.select(this)
        //       .attr('fakeclass', 'fakelegend')
        //     .transition()
        //       .duration(200)
        //       .style ("opacity", .2);

        
        //   } else {
          
        //     var elemented = document.getElementById(this.id +"-line");
        //     d3.select(elemented)
        //       .style("display", "block")
        //       .transition()
        //       .duration(200)
        //       .style("opacity",1);
          
        //     d3.select(this)
        //       .attr('fakeclass','legend')
        //       .transition()
        //       .duration(200)
        //       .style ("opacity", 1); 
        //       }
    // });

   //var legendEnter = legend
 

    // //Add the rectangles to the created legend container
    //   var size = 12;  
    //   legendEnter.append("rect")
    //       .attr("x", function(d,i){ return 250 + i*(size+50)})
    //       .attr("y", 430) // 430 is where the first rect appears. 
    //       .attr("width", size)
    //       .attr("height", size)
    //       .style("fill", "black");
    
                 
    // //Add the legend text
    //   legendEnter.append('text')
    //       .attr("x", function(d,i){ return 250 + i*(size+50) } ) 
    //       .attr("y", 430 + size*1.2 +10) // 430 is where the first rect appears. plus the distance between rect
    //       .style("fill", "white")
    //       .text(function(d){ return d.key})
    //       .attr("text-anchor", "left")
    //       .style("alignment-baseline", "middle");