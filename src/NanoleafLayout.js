/**
 * Created by Christian Bartram on 12/14/2018.
 * Github @cbartram
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PI } from './constants'

export default class NanoleafLayout extends Component {
    /**
     * Calculates an Equilateral Triangle given the sidelength and center based on the following gist
     * https://gist.github.com/julienetie/92b2e87269f7f9f0bee0
     * @param sideLength Integer the length of the triangles side
     * @param cen Array Defaults to [0, 0]
     * @returns {{topVertex: Array, rightVertex: Array, leftVertex: Array}}
     */
	static equilateral(sideLength, cen = [0, 0]) {
	  const halfSide = sideLength / 2;

      // Inner innerHypotenuse angle = 120, hyp = half side. Cos 120 * adjacent
      const innerHypotenuse = halfSide * (1 / Math.cos(30 * PI / 180));

      // SqRt(Hyp^2 - Adj^2) pythagoras
      const innerOpposite = halfSide * (1 / Math.tan(60 * PI / 180));

      let leftVertex = [];
      let rightVertex = [];
      let topVertex = [];

      leftVertex[0] = cen[0] - halfSide;
      leftVertex[1] = cen[1] + innerOpposite;

      rightVertex[0] = cen[0] + halfSide;
      rightVertex[1] = cen[1] + innerOpposite;

      topVertex[0] = cen[0];
      topVertex[1] = cen[1] - innerHypotenuse;

      return {
          topVertex,
          rightVertex,
          leftVertex
      }
	}

    /**
     * Draws an Equilateral Triangle on the Canvas and validates the data from this.props contains the correct key.
     * The following parameters are used for the calculation of the equilateral triangles.
     * @param x integer Cartesian X coordinate
     * @param y integer Cartesian Y coordinate
     * @param o integer Orientation in degrees
     * @param color hexadecimal color code Triangle Color i.e. #FF00FF
     * @param strokeColor hexadecimal color code for the Triangles stroke i.e #DDFF90
     * @param id integer the panel identifier
     */
    validate() {
      const { positionData, sideLength } = this.props.data;
        if (typeof positionData === 'undefined')
            throw new Error('Could not find property: positionData in given prop. Ensure that your data includes a positionData key with an array value');

        // Calculate the coords for an equilateral triangle
        return positionData.map(({ x, y, o, color, strokeColor, panelId }) => {
            let e = NanoleafLayout.equilateral(sideLength);
            let path = `M${e.topVertex[0]} ${e.topVertex[1]} L${e.leftVertex[0]} ${e.leftVertex[1]} L${e.rightVertex[0]} ${e.rightVertex[1]} L${e.topVertex[0]} ${e.topVertex[1]} Z`;

            const triangle = {
                x,
                y,
                rotation: o,
                color,
                strokeColor,
                path,
                panelId
            };

            this.props.onDraw(triangle);
            return triangle
        });
    }

    /**
     * Returns the integer value of a hexidecimal color code
     * @param hexString String Hexidecimal color code
     * @returns {number}
     */
     static colorAsInt(hexString) {
        if (!hexString) return 0; // cover nulls and undefined
        return parseInt(hexString.slice(1), 0x10)
      };

    /**
     * Handles recalculating values and updating when the layout changes
     * @returns {Array}
     */
    update() {
      const showCenter = false; // Used for development

      const { strokeWidth, strokeColor, color, showId, rotation, onHover, onClick, onExit } = this.props;

      //Sort panels so that strokeColor further from white are later in the array.  This prevents overlapping a non-white strokeColor with white.
      const panels = this.validate().sort((a, b) => NanoleafLayout.colorAsInt(b.strokeColor) - NanoleafLayout.colorAsInt(a.strokeColor));

      return panels.map((value, key) => {
        return (
            <g key={key} transform={`translate(${value.x},${value.y}) rotate(${value.rotation + 60})`} >
              <path
                  key={key + '_path'}
                  d={value.path}
                  strokeWidth={strokeWidth}
                  onMouseOver={() => onHover(value) }
                  onMouseOut={() => onExit(value) }
                  onClick={() => onClick(value) }
                  fill={value.color || color}
                  stroke={value.strokeColor || strokeColor}
              />
              {
                  showCenter && <circle key={key + '_circle'} cx={0} cy={0} r={5} fill={'pink'}/>
              }
              {
                showId &&
                <text key={key + '_text'}
                  fill="#FFFFFF"
                  textAnchor="middle"
                  transform={`scale(-1, 1) rotate(${value.rotation - 120 - rotation})`}
                  onClick={() => onClick(value)}>
                    {value.id}
                </text>
              }
            </g>
        )
      })
    };

    render() {
        const { positionData, sideLength } = this.props.data;
        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let maxY = 0;

        positionData.forEach(panel => {
          if (panel.x > maxX) {
            maxX = panel.x
          }
          if (panel.x < minX) {
            minX = panel.x
          }
          if (panel.y > maxY) {
            maxY = panel.y
          }
          if (panel.y < minY) {
            minY = panel.y
          }
        });

        // the min/max are now based on the center of the triangles, so we want to add a sideLength so we're
        // working with the triangle bounding boxes
        maxX += sideLength;
        minX -= sideLength;
        maxY += sideLength;
        minY -= sideLength;

        const width = (maxX - minX);
        const height = (maxY - minY);
        const midX = minX + width / 2;
        const midY = minY + height / 2;


        // For development
        const showTrueZero = false;
        const showTransZero = false;
        const showCenter = false;

        //Translate out, scale and rotate, translate back.  Makes it 'feel' like the scale and rotation are happening around the center and not around 0,0
        const transform = `translate(${midX},${midY}) scale(-1,1) rotate(${this.props.rotation + 180}) translate(${-midX},${-midY})`;

        // Use calculated to give a tight view of the panels
        const viewBox = `${minX} ${minY} ${width} ${height}`;

        return (
            <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" >
              {showTrueZero && <circle cx={0} cy={0} r={5} fill="blue" />}
              <g transform={transform}>
                {this.update()}
                {showTransZero && <circle cx={0} cy={0} r={5} fill="lightblue" />}
              </g>
              {showCenter && <circle cx={midX} cy={midY} r={5} fill="red" />}
            </svg>
        )
    }
}

NanoleafLayout.propTypes = {
    data: PropTypes.object.isRequired, //should be array
    onDraw: PropTypes.func,
    showId: PropTypes.bool,
    strokeWidth: PropTypes.number,
    opacity: PropTypes.number,
    color: PropTypes.string,
    rotation: PropTypes.number,
    onHover: PropTypes.func,
    onClick: PropTypes.func,
    onExit: PropTypes.func
};

NanoleafLayout.defaultProps = {
    onDraw: data => data,
    showId: false,
    opacity: 1,
    strokeWidth: 2,
    rotation: 0,
    color: '#333333',
    strokeColor: '#ffffff',
    onHover: data => data,
    onClick: data => data,
    onExit: data => data,
};
