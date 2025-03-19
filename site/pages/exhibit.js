import Head from 'next/head';
import { useState, useEffect } from 'react';

// TopBar component (unchanged)
const TopBar = ({ exhibitStage, handleNavClick, toggleLanguage, t }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 500,
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Language and open source text */}
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "8px 8px 4px",
      }}>
        <a style={{
          fontSize: 14,
          margin: 0,
          color: "#000"
        }}
        href="http://github.com/hackclub/juice"
        >
          {t.openSourceText}
        </a>
        <button 
          onClick={toggleLanguage}
          style={{
            padding: "5px 10px",
            backgroundColor: "#fff",
            border: "1px solid #000",
            cursor: "pointer",
            borderRadius: "4px",
            color: "#000"
          }}
        >
          {t.toggleLanguage}
        </button>
      </div>
      
      {/* Navigation tabs */}
      <div style={{
        display: "flex", 
        paddingLeft: 8, 
        paddingTop: 8, 
        paddingBottom: 8, 
        borderBottom: "1px solid #000", 
        paddingRight: 8, 
        alignItems: "center", 
        flexDirection: "row"
      }}>
        <div 
          style={{
            display: "flex", 
            alignItems: "center", 
            flexDirection: "column", 
            opacity: exhibitStage === 0 ? 1.0 : 0.5,
            cursor: "pointer"
          }}
          onClick={() => handleNavClick(0)}
        >
          <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
          </div>
          <p style={{fontSize: 14, marginTop: 2,}}>{t.navExplore}</p>
        </div>

        <div style={{height: '0.2px', marginBottom: 16, borderTop: "0.4px solid #000", borderBottom: "0.4px solid #000", width: "100%"}}>
        </div>

        <div 
          style={{
            display: "flex", 
            alignItems: "center", 
            flexDirection: "column", 
            opacity: exhibitStage === 1 ? 1.0 : 0.5,
            cursor: "pointer"
          }}
          onClick={() => handleNavClick(1)}
        >
          <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
          </div>
          <p style={{fontSize: 14, marginTop: 2,}}>{t.navRsvp}</p>
        </div>

        <div style={{height: '0.2px', marginBottom: 16, borderTop: "0.4px solid #000", borderBottom: "0.4px solid #000", width: "100%"}}>
        </div>

        <div 
          style={{
            display: "flex", 
            alignItems: "center", 
            flexDirection: "column", 
            opacity: exhibitStage === 2 ? 1.0 : 0.5,
            cursor: "pointer"
          }}
          onClick={() => handleNavClick(2)}
        >
          <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
          </div>
          <p style={{fontSize: 14, marginTop: 2,}}>{t.navTicket}</p>
        </div>

        <div style={{height: '0.2px', marginBottom: 16, borderTop: "0.4px solid #000", borderBottom: "0.4px solid #000", width: "100%"}}>
        </div>
        
        <div 
          style={{
            display: "flex", 
            alignItems: "center", 
            flexDirection: "column", 
            opacity: exhibitStage === 3 ? 1.0 : 0.5,
            cursor: "pointer"
          }}
          onClick={() => handleNavClick(3)}
        >
          <div style={{width: 52, height: 52, backgroundColor: "#fff", border: "1px solid #000"}}>
          </div>
          <p style={{fontSize: 14, marginTop: 2,}}>{t.navFriends}</p>
        </div>
      </div>
    </div>
  );
};

// Game Carousel Component
const GameCarousel = ({ games, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to handle next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  };

  // Automatically cycle through games every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex]);

  return (
    <div style={{ marginTop: 20, textAlign: 'center', overflow: 'hidden' }}>
      <h2>{t.gameShowcaseTitle}</h2>
      <div style={{ 
        display: 'flex', 
        transition: 'transform 0.5s ease-in-out', 
        transform: `translateX(-${currentIndex * 100}%)`
      }}>
        {games.map((game, index) => (
          <div 
            key={index} 
            style={{ 
              flex: '0 0 100%', 
              width: '100%', 
              textAlign: 'center', 
              padding: '0 10px',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ width: '100%', height: 100, border: '1px solid #000' }}>
              {game}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Other components (unchanged)
const PostcardsSection = ({ t }) => (
  <div style={{ marginTop: 20, textAlign: 'center' }}>
    <h2>{t.postcardsTitle}</h2>
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
      <div style={{ width: 100, height: 100, border: '1px solid #000', textAlign: 'center' }}>BottleDream Postcard</div>
      <div style={{ width: 100, height: 100, border: '1px solid #000', textAlign: 'center' }}>SparkLabs Postcard</div>
    </div>
  </div>
);

const FlightMapSection = ({ t }) => (
  <div style={{ marginTop: 20, textAlign: 'center' }}>
    <h2>{t.flightMapTitle}</h2>
    <p>{t.flightMapDescription}</p>
    <div style={{ width: '100%', height: 200, border: '1px solid #000', marginTop: 10 }}>Animated Flight Map</div>
  </div>
);

const VideoShowcaseSection = ({ t }) => (
  <div style={{ marginTop: 20, textAlign: 'center' }}>
    <h2>{t.videoShowcaseTitle}</h2>
    <p>{t.videoShowcaseDescription}</p>
    <div style={{ width: '100%', height: 200, border: '1px solid #000', marginTop: 10 }}>Showcase Video</div>
  </div>
);

const FinalCTASection = ({ t }) => (
  <div style={{ marginTop: 20, textAlign: 'center' }}>
    <button style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
      {t.claimTicket}
    </button>
    <p>{t.eventDateLocation}</p>
  </div>
);

const Footer = ({ t }) => (
  <footer style={{ marginTop: 20, textAlign: 'center', padding: '20px 0', borderTop: '1px solid #000' }}>
    <p>{t.openSourceText}</p>
    <p>{t.footerText}</p>
  </footer>
);

export default function Exhibit() {
  const [exhibitStage, setExhibitStage] = useState(0); // 0 = explore, 1 = rsvp, 2 = ticket, 3 = friends
  const [hasRSVPed, setHasRSVPed] = useState(false); // Track if user has RSVPed
  const [language, setLanguage] = useState('en'); // 'en' for English, 'zh' for Mandarin

  // List of 15 games
  const games = [
    "Game 1", "Game 2", "Game 3", "Game 4", "Game 5", 
    "Game 6", "Game 7", "Game 8", "Game 9", "Game 10", 
    "Game 11", "Game 12", "Game 13", "Game 14", "Game 15"
  ];
  
  // Translations (unchanged)
  const translations = {
    en: {
      title: "Juice Popup Cafe Exhibit",
      description: "Popup cafe of 30 games that teenagers from around the world made. Free exhibit with free juice",
      navExplore: "explore",
      navRsvp: "rsvp",
      navTicket: "ticket",
      navFriends: "friends",
      exploreTitle: "Popup Indie Game Cafe in Shanghai",
      rsvpTitle: "RSVP for the Event",
      rsvpButton: "Complete RSVP",
      rsvpSuccess: "You have successfully RSVPed!",
      ticketTitle: "Your Tickets",
      friendsTitle: "Friends",
      rsvpAlert: "Please RSVP first before accessing this section of the site",
      toggleLanguage: "中文",
      openSourceText: "open-sourced free event made with <3",
      exploreDescription: "30 high school indie game developers from 10+ countries are coming to Shanghai to make you free fresh juice and let you try their game",
      claimTicket: "claim free juice ticket",
      eventDateLocation: "April 5th - 10th @ BottleDream & SparkLabs",
      postcardsTitle: "Postcards from Our Partners",
      gameShowcaseTitle: "Games by Developers",
      flightMapTitle: "Global Flight Map",
      flightMapDescription: "High schoolers from around the world spent the past couple months making their own games and launched them to Steam.",
      videoShowcaseTitle: "Showcase Video",
      videoShowcaseDescription: "Now they all flew to Shanghai to run a popup cafe displaying their games and giving free juice to people who come visit.",
      finalCTAText: "Claim your free juice ticket now!",
      footerText: "© 2025 Juice Popup Cafe. All rights reserved."
    },
    zh: {
      title: "果汁快闪咖啡馆展览",
      description: "来自世界各地的青少年制作的30款游戏快闪咖啡馆。免费展览，提供免费果汁",
      navExplore: "探索",
      navRsvp: "预约",
      navTicket: "门票",
      navFriends: "朋友",
      exploreTitle: "上海独立游戏快闪咖啡馆",
      rsvpTitle: "活动预约",
      rsvpButton: "完成预约",
      rsvpSuccess: "您已成功预约！",
      ticketTitle: "您的门票",
      friendsTitle: "朋友",
      rsvpAlert: "请先预约，然后再访问门票或邀请朋友！",
      toggleLanguage: "English",
      openSourceText: "开源免费活动，用❤️制作",
      exploreDescription: "来自10多个国家的30位高中生独立游戏开发者将来到上海，为您提供免费新鲜果汁，并让您尝试他们的游戏",
      claimTicket: "领取免费果汁券",
      eventDateLocation: "4月5日至10日 @ BottleDream & SparkLabs",
      postcardsTitle: "合作伙伴的明信片",
      gameShowcaseTitle: "开发者制作的游戏",
      flightMapTitle: "全球飞行地图",
      flightMapDescription: "来自世界各地的高中生们花了几个月的时间制作了自己的游戏，并将它们发布到Steam上。",
      videoShowcaseTitle: "展示视频",
      videoShowcaseDescription: "现在他们都飞到了上海，经营一个快闪咖啡馆，展示他们的游戏，并为来访的人提供免费果汁。",
      finalCTAText: "立即领取您的免费果汁券！",
      footerText: "© 2025 果汁快闪咖啡馆。保留所有权利。"
    }
  };
  
  // Get current language translation
  const t = translations[language];
  
  // Function to toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };
  
  // Function to handle navigation clicks
  const handleNavClick = (stage) => {
    // If trying to access tickets or friends without RSVPing
    if ((stage === 2 || stage === 3) && !hasRSVPed) {
      alert(t.rsvpAlert);
      
      // Take them to RSVP page
      setExhibitStage(1);
      return;
    }
    
    setExhibitStage(stage);
  };
  
  // Function to complete RSVP process
  const completeRSVP = () => {
    setHasRSVPed(true);
    // Additional RSVP logic would go here
  };
  
  // Calculate the height of the top bar (approximately)
  // This is a rough estimate: language bar + nav height + padding
  const topBarHeight = 32 + 80 + 16; // in pixels
  
  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
      </Head>
      
      {/* Fixed Top Bar Component */}
      <TopBar 
        exhibitStage={exhibitStage} 
        handleNavClick={handleNavClick} 
        toggleLanguage={toggleLanguage} 
        t={t} 
      />
      
      <main style={{
        width: "100vw", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        marginTop: `${topBarHeight}px` // Add margin to offset the fixed top bar
      }}>
        <div style={{maxWidth: 500, width: "100%"}}>
          {/* Content area based on selected stage */}
          <div style={{marginTop: 6, padding: 8}}>
            {exhibitStage === 0 && (
              <div>
                <h1 style={{fontSize: 48}}>{t.exploreTitle}</h1>
                <p style={{marginTop: 12, fontSize: 18}}>{t.exploreDescription}</p>
                <div 
                onClick={() => setExhibitStage(1)}
                style={{width: "100%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16, backgroundColor: "#000", color: "#fff", padding: 12, fontSize: 32}}>
                    <p>{t.claimTicket}</p>
                </div>
                <p style={{width: "100%", textAlign: "center", marginTop: 8}}>{t.eventDateLocation}</p>
                
                {/* New sections */}
                <PostcardsSection t={t} />
                <GameCarousel games={games} t={t} />
                <FlightMapSection t={t} />
                <VideoShowcaseSection t={t} />
                <FinalCTASection t={t} />
                <Footer t={t} />
              </div>
            )}
            
            {exhibitStage === 1 && (
              <div style={{padding: 8}}>
                <h1>{t.rsvpTitle}</h1>
                {/* RSVP form would go here */}
                <button 
                  onClick={completeRSVP}
                  style={{
                    marginTop: 20,
                    padding: "10px 20px",
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {t.rsvpButton}
                </button>
                {hasRSVPed && (
                  <p style={{color: "green", marginTop: 10}}>{t.rsvpSuccess}</p>
                )}
              </div>
            )}
            
            {exhibitStage === 2 && hasRSVPed && (
              <div>
                <h1>{t.ticketTitle}</h1>
                {/* Ticket content */}
              </div>
            )}
            
            {exhibitStage === 3 && hasRSVPed && (
              <div>
                <h1>{t.friendsTitle}</h1>
                {/* Friends content */}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
