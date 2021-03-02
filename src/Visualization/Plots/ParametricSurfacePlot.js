import React from "react";
import * as d3 from "d3";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const ParametricSurfacePlot = (props) => {
  if (!props.graphSettings.style || !props.graphSettings.mark) {
    console.error(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  let dataSphere = [];
  const parameterStep1 =
    (props.graphSettings.parameter.parameter1.domain[1] -
      props.graphSettings.parameter.parameter1.domain[0]) /
    props.graphSettings.parameter.parameter1.steps;
  const parameterStep2 =
    (props.graphSettings.parameter.parameter2.domain[1] -
      props.graphSettings.parameter.parameter2.domain[0]) /
    props.graphSettings.parameter.parameter2.steps;

  for (
    let i = props.graphSettings.parameter.parameter1.domain[0];
    i <= props.graphSettings.parameter.parameter1.domain[1];
    i = i + parameterStep1
  ) {
    for (
      let j = props.graphSettings.parameter.parameter2.domain[0];
      j <= props.graphSettings.parameter.parameter2.domain[1];
      j = j + parameterStep2
    ) {
      dataSphere.push([
        props.graphSettings.mark.position.x.function(i, j),
        props.graphSettings.mark.position.y.function(i, j),
        props.graphSettings.mark.position.z.function(i, j),
        props.graphSettings.mark.style.fill.color?.scaletype
          ? props.graphSettings.mark.style.fill.color.function(i, j)
          : null,
      ]);
    }
  }
  // Getting domain for axis
  const xDomain = props.graphSettings.mark.position.x.domain
    ? props.graphSettings.mark.position.x.domain
    : GetDomain(dataSphere, 0, "linear", false);

  const yDomain = props.graphSettings.mark.position.y.domain
    ? props.graphSettings.mark.position.y.domain
    : GetDomain(dataSphere, 1, "linear", false);

  const zDomain = props.graphSettings.mark.position.z.domain
    ? props.graphSettings.mark.position.z.domain
    : GetDomain(dataSphere, 2, "linear", false);

  const colorDomain = props.graphSettings.mark.style.fill.scaleType
    ? props.graphSettings.mark.style.fill.domain
      ? props.graphSettings.mark.style.fill.domain
      : GetDomain(dataSphere, 3, "linear", false)
    : null;

  //Adding Scale

  const xScale = d3
    .scaleLinear()
    .range([0, props.graphSettings.style.dimensions.width])
    .domain(xDomain);

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([0, props.graphSettings.style.dimensions.height]);

  const zScale = d3
    .scaleLinear()
    .domain(zDomain)
    .range([0, props.graphSettings.style.dimensions.depth]);

  const colorRange = props.graphSettings.mark.style.fill.color
    ? props.graphSettings.mark.style.fill.color
    : ["#ff0000", "#ffff00"];

  const colorScale = props.graphSettings.mark.style.fill.scaleType
    ? d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;

  let meshVertices = [],
    colorMatrix = [];
  for (
    let i = props.graphSettings.parameter.parameter1.domain[0];
    i <= props.graphSettings.parameter.parameter1.domain[1];
    i = i + parameterStep1
  ) {
    for (
      let j = props.graphSettings.parameter.parameter2.domain[0];
      j <= props.graphSettings.parameter.parameter2.domain[1];
      j = j + parameterStep2
    ) {
      meshVertices.push(props.graphSettings.mark.position.x.function(i, j));
      meshVertices.push(props.graphSettings.mark.position.y.function(i, j));
      meshVertices.push(props.graphSettings.mark.position.z.function(i, j));
      colorMatrix.push(
        colorScale
          ? colorScale(props.graphSettings.mark.style.fill.color.function(i, j))
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(
        props.graphSettings.mark.position.x.function(i + parameterStep1, j)
      );
      meshVertices.push(
        props.graphSettings.mark.position.y.function(i + parameterStep1, j)
      );
      meshVertices.push(
        props.graphSettings.mark.position.z.function(i + parameterStep1, j)
      );
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.color.function(
                i + parameterStep1,
                j
              )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(
        props.graphSettings.mark.position.x.function(
          i + parameterStep1,
          j + parameterStep2
        )
      );
      meshVertices.push(
        props.graphSettings.mark.position.y.function(
          i + parameterStep1,
          j + parameterStep2
        )
      );
      meshVertices.push(
        props.graphSettings.mark.position.z.function(
          i + parameterStep1,
          j + parameterStep2
        )
      );
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.color.function(
                i + parameterStep1,
                j + parameterStep2
              )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(
        props.graphSettings.mark.position.x.function(
          i + parameterStep1,
          j + parameterStep2
        )
      );
      meshVertices.push(
        props.graphSettings.mark.position.y.function(
          i + parameterStep1,
          j + parameterStep2
        )
      );
      meshVertices.push(
        props.graphSettings.mark.position.z.function(
          i + parameterStep1,
          j + parameterStep2
        )
      );
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.color.function(
                i + parameterStep1,
                j + parameterStep2
              )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(
        props.graphSettings.mark.position.x.function(i, j + parameterStep2)
      );
      meshVertices.push(
        props.graphSettings.mark.position.y.function(i, j + parameterStep2)
      );
      meshVertices.push(
        props.graphSettings.mark.position.z.function(i, j + parameterStep2)
      );
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.color.function(
                i,
                j + parameterStep2
              )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(props.graphSettings.mark.position.x.function(i, j));
      meshVertices.push(props.graphSettings.mark.position.y.function(i, j));
      meshVertices.push(props.graphSettings.mark.position.z.function(i, j));
      colorMatrix.push(
        colorScale
          ? colorScale(props.graphSettings.mark.style.fill.color.function(i, j))
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );
    }
  }

  //Axis
  const xAxis = props.graphSettings.axis["x-axis"] ? (
    <XAxis
      domain={xScale.ticks(
        props.graphSettings.axis["x-axis"].ticks?.noOfTicks
          ? props.graphSettings.axis["x-axis"].ticks.noOfTicks
          : 5
      )}
      tick={props.graphSettings.axis["x-axis"].ticks}
      scale={xScale}
      orient={props.graphSettings.axis["x-axis"].orient}
      title={props.graphSettings.axis["x-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
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
      domain={zScale.ticks(
        props.graphSettings.axis["z-axis"].ticks?.noOfTicks
          ? props.graphSettings.axis["z-axis"].ticks.noOfTicks
          : 5
      )}
      tick={props.graphSettings.axis["z-axis"].ticks}
      scale={zScale}
      orient={props.graphSettings.axis["z-axis"].orient}
      title={props.graphSettings.axis["z-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
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

  const stroke_bool = props.graphSettings.mark.style.stroke ? true : false;
  const stroke_width = props.graphSettings.mark.style.stroke?.width
    ? props.graphSettings.mark.style.stroke?.width
    : 1;
  const stroke_color = props.graphSettings.mark.style.stroke?.color
    ? props.graphSettings.mark.style.stroke?.color
    : "#000000";
  const stroke_opacity = props.graphSettings.mark.style.stroke?.opacity
    ? props.graphSettings.mark.style.stroke?.opacity
    : 1;

  return (
    <>
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
      <a-frame-mesh-from-points
        points={JSON.stringify(meshVertices)}
        color={JSON.stringify(colorMatrix)}
        stroke_bool={stroke_bool}
        stroke_color={stroke_color}
        stroke_width={stroke_width}
        stroke_opacity={stroke_opacity}
        opacity={props.graphSettings.mark.style.fill.opacity}
      />
      <a-box
        class="clickable"
        width={props.graphSettings.style.dimensions.width}
        height={props.graphSettings.style.dimensions.height}
        depth={props.graphSettings.style.dimensions.depth}
        position={`${props.graphSettings.style.dimensions.width / 2} ${
          props.graphSettings.style.dimensions.height / 2
        } ${props.graphSettings.style.dimensions.depth / 2}`}
        opacity={0}
      />
    </>
  );
};

export default ParametricSurfacePlot;