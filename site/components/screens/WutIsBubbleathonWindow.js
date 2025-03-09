import React, { useRef } from 'react';

export default function WutIsBubbleathonWindow({
  position,
  isDragging,
  isActive,
  handleMouseDown,
  handleDismiss,
  handleWindowClick,
  BASE_Z_INDEX,
  ACTIVE_Z_INDEX,
}) {
  const contentRef = useRef(null);

  const isBubbleathonTime = () => {
    return Date.now() > 1741447800000 && Date.now() < 1741465800000;
  };

  const formatLocalTime = () => {
    const startDate = new Date(1741447800000); // 10.30am EST
    const endDate = new Date(1741465800000); // 3.30pm EST

    const startOptions = {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    };

    const dateOptions = {
      month: 'short',
      day: 'numeric',
    };

    const localStartTime = startDate.toLocaleTimeString(
      undefined,
      startOptions
    );
    const localStartDate = startDate.toLocaleDateString(undefined, dateOptions);
    const localEndTime = endDate.toLocaleTimeString(undefined, startOptions);
    const localEndDate = endDate.toLocaleDateString(undefined, dateOptions);

    return `from ${localStartTime} ${localStartDate} to ${localEndTime} ${localEndDate}`;
  };

  return (
    <div
      style={{
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        top: '50%',
        left: '50%',
        position: 'absolute',
        zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX,
        pointerEvents: isActive ? 'auto' : 'none',
        visibility: isActive ? 'visible' : 'hidden',
      }}
    >
      <div
        onClick={handleWindowClick('wutIsBubbleathon')}
        style={{
          display: 'flex',
          width: 650,
          color: 'black',
          height: 300,
          backgroundColor: '#fff',
          border: '1px solid #000',
          borderRadius: 4,
          flexDirection: 'column',
          padding: 0,
          userSelect: 'none',
          animation: 'linear .3s windowShakeAndScale',
        }}
      >
        <div
          onMouseDown={handleMouseDown('wutIsBubbleathon')}
          style={{
            display: 'flex',
            borderBottom: '1px solid #00000020',
            padding: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            cursor: isDragging ? 'grabbing' : 'grab',
            backgroundColor: '#f6e7ba',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss('wutIsBubbleathon');
              }}
            >
              x
            </button>
          </div>
          <p>wutIsBubbleathon.txt</p>
          <div></div>
        </div>

        <div
          ref={contentRef}
          style={{
            flex: 1,
            padding: 16,
            outline: 'none',
            overflowY: 'auto',
            cursor: 'text',
            userSelect: 'text',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p>

              Helloo! {' '}
              <a
                href="https://hackclub.slack.com/team/U08BZGJBAAY"
                target="_blank"
                rel="noopener noreferrer"
              >
                Neha
              </a>{' '}
              and{' '}
              <a
                href="https://hackclub.slack.com/team/U07DJMFAQQP"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tongyu
              </a>{' '}
              here!
            </p>
            <p>
              Join us in this week's juiceathon: Bubbleathon! The theme is "Bows and Bubbles",
              thanks to International Women's Day (8 Mar!), National Dishwasher Day
              (9 Mar!!), and National Bubblegum Week (which is this week!!!).
            </p>
            <p>
              It's just for 5 hours, but we're gonna go all in 🙌! Join us on Zoom
              and work on your game, make assets, write music! Even if you can't stay
              for the whole duration, it would be wonderful to see you pop by and hang
              out with other juicers for a while.
            </p>
            <p>
              In your timezone, Bubbleathon will go from {formatLocalTime()}.
              We hope to see you there!
            </p>
            {isBubbleathonTime() && (
              <a
                href="https://hack.af/z-join?id=h6tp88"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  alignSelf: 'center',
                  marginTop: '8px',
                  textDecoration: 'none',
                }}
              >
                <img
                  src="/JoinButton.png"
                  alt="relay icon"
                  style={{
                    width: '140px',
                    height: '64px',
                    imageRendering: 'pixelated',
                  }}
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
