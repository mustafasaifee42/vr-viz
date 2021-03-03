import React from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";
import _ from "lodash";

const StackedBarGraph = (props) => {
  if (!props.data || !props.graphSettings.style || !props.graphSettings.mark) {
    console.warn(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  const data = d3.stack().keys(props.graphSettings.mark.style.fill.field)(
    props.data
  );

  const xDomain = props.graphSettings.mark.position.x.domain
    ? props.graphSettings.mark.position.x.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.position.x.field,
        "ordinal",
        props.graphSettings.mark.position.x.startFromZero
      );

  const yDomain = props.graphSettings.mark.style.height.domain
    ? props.graphSettings.mark.style.height.domain
    : GetDomain(
        _.flattenDepth(data, 1),
        1,
        "linear",
        props.graphSettings.mark.style.height.startFromZero
      );

  const zDomain = props.graphSettings.mark.position.z.domain
    ? props.graphSettings.mark.position.z.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.position.z.field,
        "ordinal",
        props.graphSettings.mark.position.z.startFromZero
      );

  //Adding Scale

  const xScale = d3
    .scaleBand()
    .range([0, props.graphSettings.style.dimensions.width])
    .domain(xDomain)
    .paddingInner(props.graphSettings.mark.style.padding.x);

  const width = xScale.bandwidth();

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([0, props.graphSettings.style.dimensions.height]);

  const zScale = d3
    .scaleBand()
    .domain(zDomain)
    .range([0, props.graphSettings.style.dimensions.depth])
    .paddingInner(props.graphSettings.mark.style.padding.z);

  const depth = zScale.bandwidth();

  const radius = depth > width ? width / 2 : depth / 2;

  //Adding marks
  const marks = data.map((d, i) =>
    d.map((d1, j) => {
      const hght =
        yScale(d1[1] - d1[0]) !== 0 ? yScale(d1[1] - d1[0]) : 0.000000000001;
      const color = props.graphSettings.mark.style.fill.color[i];
      const position = `${
        xScale(d1.data[props.graphSettings.mark.position.x.field]) + width / 2
      } ${yScale(d1[0]) + hght / 2} ${
        zScale(d1.data[props.graphSettings.mark.position.z.field]) + depth / 2
      }`;
      const hoverText = props.graphSettings.mark.mouseOver?.label
        ? props.graphSettings.mark.mouseOver.label
            .value(d1.data)
            .replace("Label", `${d.key}`)
            .replace("LabelValue", `${d1.data[d.key]}`)
        : null;
      return (
        <Shape
          key={`${i}_${j}`}
          type={props.graphSettings.mark.type}
          color={`${color}`}
          opacity={props.graphSettings.mark.style.fill.opacity}
          depth={`${depth}`}
          height={`${hght}`}
          width={`${width}`}
          radius={`${radius}`}
          segments={
            props.graphSettings.mark.style.segments
              ? `${props.graphSettings.mark.style.segments}`
              : "16"
          }
          position={position}
          hover={props.graphSettings.mark.mouseOver}
          hoverText={hoverText}
          graphID={props.graphID}
        />
      );
    })
  );

  //Axis
  const xAxis = props.graphSettings.axis["x-axis"] ? (
    <XAxis
      domain={xDomain}
      tick={props.graphSettings.axis["x-axis"].ticks}
      scale={xScale}
      orient={props.graphSettings.axis["x-axis"].orient}
      title={props.graphSettings.axis["x-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
      padding={width}
      grid={props.graphSettings.axis["x-axis"].grid}
    />
  ) : null;

  const yAxis = props.graphSettings.axis["y-axis"] ? (
    <YAxis
      domain={yScale.ticks(
        props.graphSettings.axis["y-axis"].ticks?.noOfTicks
          ? props.graphSettings.axis["y-axis"].ticks.noOfTicks
          : 5
      )}
      tick={props.graphSettings.axis["y-axis"].ticks}
      scale={yScale}
      orient={props.graphSettings.axis["y-axis"].orient}
      title={props.graphSettings.axis["y-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
      grid={props.graphSettings.axis["y-axis"].grid}
    />
  ) : null;

  const zAxis = props.graphSettings.axis["z-axis"] ? (
    <ZAxis
      domain={zDomain}
      tick={props.graphSettings.axis["z-axis"].ticks}
      scale={zScale}
      orient={props.graphSettings.axis["z-axis"].orient}
      title={props.graphSettings.axis["z-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
      padding={depth}
      grid={props.graphSettings.axis["z-axis"].grid}
    />
  ) : null;

  const box = props.graphSettings.axis["axis-box"] ? (
    <AxisBox
      width={props.graphSettings.style.dimensions.width}
      height={props.graphSettings.style.dimensions.height}
      depth={props.graphSettings.style.dimensions.depth}
      color={
        props.graphSettings.axis["axis-box"].color
          ? props.graphSettings.axis["axis-box"].color
          : "#000000"
      }
    />
  ) : null;
  return (
    <>
      {marks}
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
    </>
  );
};

export default StackedBarGraph;
