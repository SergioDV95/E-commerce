/* eslint-disable react/prop-types */

const DeleteSvg = ({ onClick }) => {
  return (
    <svg
      onClick={onClick}
      className="hover:stroke-[#d33030] stroke-[#667085]"
      width="30px"
      height="30px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M10 11V17"
          stroke=""
          strokeWidth="1.8000000000000005"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
        <path
          d="M14 11V17"
          stroke=""
          strokeWidth="1.8000000000000005"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
        <path
          d="M4 7H20"
          stroke=""
          strokeWidth="1.8000000000000005"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
        <path
          d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
          stroke=""
          strokeWidth="1.8000000000000005"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
        <path
          d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
          stroke=""
          strokeWidth="1.8000000000000005"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{" "}
      </g>
    </svg>
  );
};

export default DeleteSvg;