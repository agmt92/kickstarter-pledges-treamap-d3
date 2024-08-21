const kickPledgeURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';
const movieSalesURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
const videoGameSalesURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

const w = 750;
const h = 700;
const margin = { top: 0, right: 50, bottom: 0, left: 0 }; // Adjusted margins

const tooltipFunct = (data) => {
    const name = data.name;
    const category = data.category;
    const value = data.value;

    let result = `Name: ${name}<br>Category: ${category}<br>Value: ${value}`;
    return result;
}


const drawChart = (url) => {
    d3.json(url)
        .then(data => {
            const svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .style("display", "flex")
                .attr("id", "treemap")
                .style("flex-direction", "row")
                .style("margin", `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`);

            
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);

            const treemap = d3.treemap()
                .size([w, h])
                .padding(1);

            treemap(root);

            const color = d3.scaleOrdinal(d3.schemePastel1);

            const cell = svg.selectAll("g")
                .data(root.leaves())
                .enter()
                .append("g")
                .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

            cell.append("rect")
                .attr("class", "tile")
                .attr("data-name", d => d.data.name)
                .attr("data-category", d => d.data.category)
                .attr("data-value", d => d.value)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .attr("fill", d => color(d.data.category))
                .attr("stroke", "black")
                .attr("stroke-width", 0.5)
                .on("mouseover", (event, d) => {
                    const { name, category, value } = d.data;
                    const tooltip = d3.select("#tooltip");
                    tooltip.transition()
                        .duration(0)
                        .style("opacity", 0.9);
                    tooltip.html(`Name: ${name}<br>Category: ${category}<br>Value: ${value}`)
                        .attr("data-value", value)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 50) + "px");
                })
                .on("mouseout", () => {
                    const tooltip = d3.select("#tooltip");
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            cell.append("text")
                .selectAll("tspan")
                .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
                .enter()
                .append("tspan")
                .attr("x", 3)
                .attr("y", (d, i) => 10 + i * 10)
                .text(d => d)
                .style("font-size", "6px")
                .style("fill", "black")
                .style("font-family", "sans-serif")
                .style("text-shadow", "1px 1px 1px grey")
                .style("letter-spacing", "0.5px")
                .style("text-align", "left")
                .style("flex-align", "top")
                .style("overflow", "hidden")

            const categories = root.leaves().map(d => d.data.category);
            const uniqueCategories = categories.filter((category, index) => categories.indexOf(category) === index);
            const titleStrings = data.name;
            const legendWidth = 650;
            const legendRectSize = 25;
            const legendSpacing = 20;

            d3.select("body")
                .append("h1")
                .attr("id", "title")
                .text(titleStrings)
                .append("p")
                .attr("id", "description")
                .text('')

            const legend = d3.select("#chart")
                .append("svg")
                .attr("transform", `translate(${w / 7}, 5)`)
                .attr("width", legendWidth)
                .attr("height", 300)
                .attr("id", "legend")
                .style("display", "flex")
                .style("flex-direction", "row-reverse")
                .style("justify-content", "center")
                .style("align-items", "right")
                .style("margin-right", "0px")
                .style("margin-left", "0px");


            const legendItem = legend.selectAll("g")
                .data(uniqueCategories)
                .enter()
                .append("g")
                .attr("transform", (d, i) => `translate(${Math.floor(i / 4) * (legendWidth / 4)}, ${(i % 4) * (legendRectSize + legendSpacing * 4)})`);
            
            legendItem.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("class", "legend-item")
                .attr("width", legendRectSize)
                .attr("height", legendRectSize)
                .attr("fill", d => color(d));
            
            legendItem.append("text")
                .attr("x", legendRectSize + legendSpacing - 15)
                .attr("y", legendRectSize - legendSpacing + 12)
                .text(d => d)
                .style("font-size", "16px");

            // tooltip

            const tooltip = d3.select("#chart")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "grey")
                .style("border", "1px solid black")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("pointer-events", "none");

            // mouseover event
            cell.on("mouseover", (event, d) => {
                const { name, category, value } = d.data;
                const tooltip = d3.select("#tooltip");
                tooltip.transition()
                    .duration(0)
                    .style("opacity", 0.9);
                tooltip.html(tooltipFunct(d.data))
                    .attr("data-value", value)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 50) + "px");
            });

            // mouseout event

            cell.on("mouseout", () => {
                const tooltip = d3.select("#tooltip");
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
            
        })
        .catch(err => console.log(err));
};



document.addEventListener('DOMContentLoaded', () => {
    const body = d3.select("body");

    // create a bootstrap navbar with the buttons below in it
    const navbar = body.append("nav")
        .attr("class", "navbar navbar-expand-lg navbar-light bg-light")
        .style("justify-content", "center")
        .style("padding", "10px")
        .style("width", "100%")
        .style("position", "fixed")
        .style("top", "0")
        .style("z-index", "1000")
        .style("background-color", "silver")
        .style("border-radius", "5px")
        .style("box-shadow", "0 2px 4px 0 black")
        .style("border", "1px solid black")
        .style("border-bottom", "none")
        .style("border-top-left-radius", "5px")
        .style("border-top-right-radius", "5px")
        .style("border-bottom-left-radius", "0")
        .style("border-bottom-right-radius", "0");

        // append a button group to the navbar
        const btnGroup = navbar.append("div")
        .attr("class", "btn-group")
        .attr("role", "group")
        .attr("aria-label", "Basic radio toggle button group");

        btnGroup.append("button")
        .attr("id", "kickstarter")
        .attr("class", "btn btn-primary")
        .text("Kickstarter")
        .style("margin", "10px")
        .on("click", () => {
            d3.selectAll("svg").remove();
            drawChart(kickPledgeURL);
        });
        
        btnGroup.append("button")
        .attr("id", "movie")
        .attr("class", "btn btn-primary")
        .text("Movie")
        .style("margin", "10px")
        .on("click", () => {
            d3.selectAll("svg").remove();
            drawChart(movieSalesURL);
        });
        
        btnGroup.append("button")
        .attr("id", "video")
        .attr("class", "btn btn-primary")
        .text("Video Game")
        .style("margin", "10px")
        .on("click", () => {
            d3.selectAll("svg").remove();
            drawChart(videoGameSalesURL);
        });


        

    drawChart(kickPledgeURL);

}
);
