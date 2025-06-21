"use client";

export default async function CallingFeature({ receiverId }: { receiverId: string }) {
   console.log("CallingFeature receiverId: ", receiverId);
   // const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
   // console.log("Local stream: ", localStream);
   
   // const peer = new RTCPeerConnection();
   // localStream.getTracks().forEach((track) => {
   //    peer.addTrack(track, localStream);
   // });

   // peer.onicecandidate = (event) => {
   //    if (event.candidate) {

   //    }
   // }




  return (
    <>
      <button>{audioCall}</button>
      <button>{videoCall}</button>
    </>
  );
}

const audioCall = (
  <svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 512 512"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
  </svg>
);
const videoCall = (
  <svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 24 24"
    aria-hidden="true"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z"></path>
  </svg>
);
