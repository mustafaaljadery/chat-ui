import { Dispatch, SetStateAction } from 'react';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const InfoIcon = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
        fill="#363636"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const sidebarOpenIcon = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="my-auto"
    >
      <path
        d="M12.95 1.50005C12.95 1.25152 12.7485 1.05005 12.5 1.05005C12.2514 1.05005 12.05 1.25152 12.05 1.50005L12.05 13.5C12.05 13.7486 12.2514 13.95 12.5 13.95C12.7485 13.95 12.95 13.7486 12.95 13.5L12.95 1.50005ZM6.5683 3.93188C6.39257 3.75614 6.10764 3.75614 5.93191 3.93188C5.75617 4.10761 5.75617 4.39254 5.93191 4.56827L8.41371 7.05007L0.499984 7.05007C0.251456 7.05007 0.0499847 7.25155 0.0499847 7.50007C0.0499846 7.7486 0.251457 7.95007 0.499984 7.95007L8.41371 7.95007L5.93191 10.4319C5.75617 10.6076 5.75617 10.8925 5.93191 11.0683C6.10764 11.244 6.39257 11.244 6.56831 11.0683L9.8183 7.81827C9.99404 7.64254 9.99404 7.35761 9.8183 7.18188L6.5683 3.93188Z"
        fill="#363636"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const sidebarCloseIcon = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="my-auto"
    >
      <path
        d="M2.05005 13.5C2.05005 13.7485 2.25152 13.95 2.50005 13.95C2.74858 13.95 2.95005 13.7485 2.95005 13.5L2.95005 1.49995C2.95005 1.25142 2.74858 1.04995 2.50005 1.04995C2.25152 1.04995 2.05005 1.25142 2.05005 1.49995L2.05005 13.5ZM8.4317 11.0681C8.60743 11.2439 8.89236 11.2439 9.06809 11.0681C9.24383 10.8924 9.24383 10.6075 9.06809 10.4317L6.58629 7.94993L14.5 7.94993C14.7485 7.94993 14.95 7.74846 14.95 7.49993C14.95 7.2514 14.7485 7.04993 14.5 7.04993L6.58629 7.04993L9.06809 4.56813C9.24383 4.39239 9.24383 4.10746 9.06809 3.93173C8.89236 3.75599 8.60743 3.75599 8.4317 3.93173L5.1817 7.18173C5.00596 7.35746 5.00596 7.64239 5.1817 7.81812L8.4317 11.0681Z"
        fill="#363636"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}: Props) {
  return (
    <div className="flex w-full flex-row border-b px-3 py-2 justify-between items-between">
      <button
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
        }}
        className="p-1.5 h-fit my-auto rounded bg-gray-50 hover:bg-gray-100"
      >
        {sidebarOpen ? sidebarCloseIcon() : sidebarOpenIcon()}
      </button>
      <div className="flex flex-col justify-center items-center space-y-0.5">
        <h1 className="text-sm font-bold text-[#363636]">
          Open-Source AI Chatbot
        </h1>
        <span className="text-xs font-regular text-gray-400">
          Welcome, just enter your OpenAI api-key.
        </span>
      </div>
      <button className="my-auto h-fit p-1.5 rounded bg-gray-50 hover:bg-gray-100">
        <InfoIcon />
      </button>
    </div>
  );
}
