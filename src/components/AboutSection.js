"use client";
import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="aboutBlock flex flex-col justify-center items-center">
      <span className="aboutTitle">About me</span>
      <span className="aboutDescription">
        A 19 year old bloke whose hobby is to create websites. Started with
        coding robots 3 years ago. Now focusing on using ReactJS and
        libraries.
      </span>
      <div className="aboutRow flex">
        <span className="more-btn flex">
          More about me{" "}
          <Image
            src="/searchIcon.svg"
            alt="searchIcon"
            width={20}
            height={20}
            className="searchIcon"
          />
        </span>
        <span className="contact-btn flex">
          Contact me
          <Image
            src="/arrowRight.svg"
            alt="arrowRight"
            width={20}
            height={20}
            className="arrowRight"
          />
        </span>
      </div>
    </div>
  );
}
