import React from "react";
import * as d3 from "d3";
import _ from "lodash";
import GetDomain from "../../utils/GetDomain";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const MeshPlot = (props) => {
  if (!props.data || !props.graphSettings.style || !props.graphSettings.mark) {
    console.warn(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  const xDomain = props.graphSettings.mark.position.x.domain
    ? props.graphSettings.mark.position.x.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.position.x.field,
        props.graphSettings.mark.position.x.scaleType
          ? props.graphSettings.mark.position.x.scaleType
          : "ordinal",
        props.graphSettings.mark.position.x.startFromZero
      );

  const zDomain = props.graphSettings.mark.position.z.domain
    ? props.graphSettings.mark.position.z.domain
    : Object.keys(props.data[0]).map((d) =>
        d !== props.graphSettings.mark.position.x.field ? d : null
      );

  let yDomain = props.graphSettings.mark.position.y?.domain;
  if (!yDomain) {
    let dataList = [];
    for (let k = 0; k < zDomain.length; k++) {
      for (let i = 0; i < props.data.length; i++) {
        dataList.push(props.data[i][zDomain[k]]);
      }
    }
    yDomain = props.graphSettings.mark.position.y.startFromZero
      ? [0, _.max(dataList)]
      : [_.min(dataList), _.max(dataList)];
  }

  let dataCoordinate = [];
  for (let i = 0; i < props.data.length; i++) {
    for (let j = 0; j < zDomain.length; j++) {
      dataCoordinate.push([
        props.data[i][props.graphSettings.mark.position.x.field],
        props.data[i][zDomain[j]],
        zDomain[j],
      ]);
    }
  }

  const colorDomain = props.graphSettings.mark.style.fill.scaleType
    ? props.graphSettings.mark.style.fill.domain
      ? props.graphSettings.mark.style.fill.domain
      : GetDomain(
          dataCoordinate,
          props.graphSettings.mark.style.fill.axis,
          "linear",
          false
        )
    : null;

  //Adding Scale

  const xScale =
    props.graphSettings.mark.position.x.scaleType === "linear"
      ? d3
          .scaleLinear()
          .range([0, props.graphSettings.style.dimensions.width])
          .domain(xDomain)
      : d3
          .scaleOrdinal()
          .range(
            xDomain.map(
              (_d, i) =>
                (i * props.graphSettings.style.dimensions.width) /
                (xDomain.length - 1)
            )
          )
          .domain(xDomain);

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([0, props.graphSettings.style.dimensions.height]);

  const zScale =
    props.graphSettings.mark.position.z.scaleType === "linear"
      ? d3
          .scaleLinear()
          .range([0, props.graphSettings.style.dimensions.depth])
          .domain(zDomain)
      : d3
          .scaleOrdinal()
          .range(
            zDomain.map(
              (_d, i) =>
                (i * props.graphSettings.style.dimensions.depth) /
                (zDomain.length - 1)
            )
          )
          .domain(zDomain);

  const colorRange = props.graphSettings.mark.style.fill.color
    ? props.graphSettings.mark.style.fill.color
    : ["#ff0000", "#ffff00"];

  const colorScale = props.graphSettings.mark.style.fill.scaleType
    ? d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;

  //Adding marks

  let meshVertices = [],
    colorMatrix = [];
  for (let i = 0; i < props.data.length - 1; i++) {
    for (let j = 0; j < zDomain.length - 1; j++) {
      meshVertices.push(
        xScale(props.data[i][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i][zDomain[j]]));
      meshVertices.push(zScale(zDomain[j]));
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.axis === 1
                ? colorScale(props.data[i][zDomain[j]])
                : props.graphSettings.mark.style.fill.axis === 2
                ? colorScale(zDomain[j])
                : colorScale(
                    props.data[i][props.graphSettings.mark.position.x.field]
                  )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(
        xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i + 1][zDomain[j]]));
      meshVertices.push(zScale(zDomain[j]));
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.axis === 1
                ? colorScale(props.data[i][zDomain[j]])
                : props.graphSettings.mark.style.fill.axis === 2
                ? colorScale(zDomain[j])
                : colorScale(
                    props.data[i][props.graphSettings.mark.position.x.field]
                  )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(
        xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i + 1][zDomain[j + 1]]));
      meshVertices.push(zScale(zDomain[j + 1]));
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.axis === 1
                ? colorScale(props.data[i][zDomain[j]])
                : props.graphSettings.mark.style.fill.axis === 2
                ? colorScale(zDomain[j])
                : colorScale(
                    props.data[i][props.graphSettings.mark.position.x.field]
                  )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(
        xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i + 1][zDomain[j + 1]]));
      meshVertices.push(zScale(zDomain[j + 1]));
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.axis === 1
                ? colorScale(props.data[i][zDomain[j]])
                : props.graphSettings.mark.style.fill.axis === 2
                ? colorScale(zDomain[j])
                : colorScale(
                    props.data[i][props.graphSettings.mark.position.x.field]
                  )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(
        xScale(props.data[i][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i][zDomain[j + 1]]));
      meshVertices.push(zScale(zDomain[j + 1]));
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.axis === 1
                ? colorScale(props.data[i][zDomain[j]])
                : props.graphSettings.mark.style.fill.axis === 2
                ? colorScale(zDomain[j])
                : colorScale(
                    props.data[i][props.graphSettings.mark.position.x.field]
                  )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );

      meshVertices.push(
        xScale(props.data[i][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i][zDomain[j]]));
      meshVertices.push(zScale(zDomain[j]));
      colorMatrix.push(
        colorScale
          ? colorScale(
              props.graphSettings.mark.style.fill.axis === 1
                ? colorScale(props.data[i][zDomain[j]])
                : props.graphSettings.mark.style.fill.axis === 2
                ? colorScale(zDomain[j])
                : colorScale(
                    props.data[i][props.graphSettings.mark.position.x.field]
                  )
            )
          : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#000000"
      );
    }
  }

  //Axis
  const xAxis = props.graphSettings.axis["x-axis"] ? (
    <XAxis
      domain={
        props.graphSettings.mark.position.z.scaleType === "linear"
          ? xScale.ticks(
              props.graphSettings.axis["x-axis"].ticks?.noOfTicks
                ? props.graphSettings.axis["x-axis"].ticks.noOfTicks
                : 5
            )
          : xDomain
      }
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
      domain={
        props.graphSettings.mark.position.z.scaleType === "linear"
          ? zScale.ticks(
              props.graphSettings.axis["z-axis"].ticks?.noOfTicks
                ? props.graphSettings.axis["z-axis"].ticks.noOfTicks
                : 5
            )
          : zDomain
      }
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

export default MeshPlot;
