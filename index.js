d3.select("div").append("h1").attr("id", "title").text("GDP");
const w = 900;
const h = 500;
const padding = 70;

const svg = d3.select("div").append("svg").attr("width", w).attr("height", h);
async function getData() {
  return fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((d) => {
      return d;
    });
}
async function proceede() {
  const data = await getData();
  const values = data["data"];
  const dates = values.map((v) => {
    return v[0];
  });
  const gdp = values.map((v) => {
    return v[1];
  });
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(
        dates,
        (v) =>
          new Date(v).getFullYear() +
          new Date(v).getMonth() * 0.1 +
          new Date(v).getDay() * 0.01
      ),
      d3.max(
        dates,
        (v) =>
          new Date(v).getFullYear() +
          new Date(v).getMonth() * 0.1 +
          new Date(v).getDay() * 0.01
      ),
    ])
    .range([padding, w - padding]);
  const xAxisScale = d3
    .scaleLinear()
    .domain([
      d3.min(
        dates,
        (v) =>
          new Date(v).getFullYear() +
          new Date(v).getMonth() * 0.1 +
          new Date(v).getDay() * 0.01
      ),
      d3.max(
        dates,
        (v) =>
          new Date(v).getFullYear() +
          new Date(v).getMonth() * 0.1 +
          new Date(v).getDay() * 0.01
      ),
    ])
    .range([padding, w - padding]);
  const xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .attr("transform", "translate(0, " + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp, (v) => v)])
    .range([0, h - padding]);
  const yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp, (v) => v)])
    .range([h - padding, 0]);
  const yAxis = d3.axisLeft(yAxisScale);
  svg
    .append("g")
    .attr("transform", "translate( " + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis);

  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d, i) => {
      return dates[i];
    })
    .attr("data-gdp", (d, i) => {
      return gdp[i];
    })
    .attr("x", (d, i) => {
      return xScale(
        new Date(d[0]).getFullYear() +
          new Date(d[0]).getMonth() * 0.1 +
          new Date(d[0]).getDay() * 0.01
      );
    })
    .attr("y", (d) => {
      return h - yScale(d[1]) - padding;
    })
    .attr("width", 2.6)
    .attr("height", (d) => {
      return yScale(d[1]);
    })
    .on("mouseover", (d, i) => {
      const block = svg
        .append("g")
        .attr("x", () => {
          return d.x;
        })
        .attr("y", () => {
          return h / 1.5;
        })
        .attr("class", "block");
      block
        .append("rect")
        .attr("width", 170)
        .attr("height", 70)
        .attr("class", "t-rect")
        .attr("x", () => {
          return i[1] > 12500 ? d.x - 200 : d.x;
        })
        .attr("y", () => {
          return h / 1.5;
        });
      block
        .append("text")
        .attr("data-date", i[0])
        .attr("id", "tooltip")
        .attr("x", () => {
          return i[1] > 12500 ? d.x - 190 : d.x + 10;
        })
        .attr("y", () => {
          return h / 1.5 + 50;
        })
        .text("GDP:$" + i[1] + "Billon");
      block
        .append("text")
        .attr("data-date", i[0])
        .attr("x", () => {
          return i[1] > 12500 ? d.x - 160 : d.x + 40;
        })
        .attr("y", () => {
          return h / 1.5 + 20;
        })
        .text(i[0]);
    })
    .on("mouseout", (d) => {
      d3.selectAll(".block").remove();
    });

  console.log(yScale(411));
  console.log(JSON.stringify(data));
}
proceede();