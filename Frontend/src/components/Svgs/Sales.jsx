/* eslint-disable react/prop-types */

const SalesSvg = ({ currentColor }) => {
  return (
    <svg
      version="1.0"
      id="Layer_1"
      width="24px"
      height="24px"
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      xmlSpace="preserve"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g id="SVGRepo_iconCarrier">
        {" "}
        <g>
          {" "}
          <polygon
            fill="none"
            stroke={currentColor}
            strokeWidth="1.80"
            strokeMiterlimit="10"
            points="21.903,5 55,38.097 34.097,59 1,25.903 1,5 "
          />{" "}
          <polyline
            fill="none"
            stroke={currentColor}
            strokeWidth="1.80"
            strokeMiterlimit="10"
            points="29.903,5 63,38.097 42.097,59 "
          />{" "}
          <circle
            fill="none"
            stroke={currentColor}
            strokeWidth="1.80"
            strokeMiterlimit="10"
            cx="14"
            cy="18"
            r="5"
          />{" "}
        </g>{" "}
      </g>
    </svg>
  );
};

export default SalesSvg;