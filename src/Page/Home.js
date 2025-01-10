import React, { useState } from "react";
import "../Page/css/Home.css";
import { TypingMultiline } from "react-kr-typing-anim";
import Button from "react-bootstrap/Button";
import { HashLink } from "react-router-hash-link";

function Home() {
  const [show, setShow] = useState(false);

  const str1 = "야, 너도 할 수 있어 유튜브";
  const str2 = `YouWithMe`;

  return (
    <div id="home" className="HomeTop">
      <TypingMultiline
        className="typing-1"
        ContainerTag="span"
        Tag="h2"
        strs={`${str1}`}
      />
      <div>
        <TypingMultiline
          className="typing-2"
          preDelay={2800}
          ContainerTag="span"
          Tag="h2"
          strs={`${str2}`}
          onDone={() => setShow(true)}
        />
      </div>
      {show && (
        <div className="my-link">
          <Button
            as={HashLink}
            smooth
            to="#introduce"
            className="button"
            variant="primary"
          >
            Learn More
          </Button>
        </div>
      )}
    </div>
  );
}

export default Home;
