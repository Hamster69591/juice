import React, { useState, useEffect, useRef } from 'react';

export default function V1Challenge({ userData, handleThirdChallengeOpen }) {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [currentPattern, setCurrentPattern] = useState(0);
  const patternCycleRef = useRef(0); // Keep track of pattern cycles
  const [isHovering, setIsHovering] = useState(false); // Track hover state
  const [isV1Tapped, setIsV1Tapped] = useState(false); // Track if card has been tapped
  const [displayText, setDisplayText] = useState(""); // For typewriter effect
  const [typingComplete, setTypingComplete] = useState(false); // Track if typing is done
  const [gameWebsiteUrl, setGameWebsiteUrl] = useState(""); // For game website URL
  const [githubLink, setGithubLink] = useState(""); // For GitHub repository link
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for tracking submission
  const [repoData, setRepoData] = useState(null); // Store repository data
  const [commitData, setCommitData] = useState(null); // Store commit activity data
  const [isLoading, setIsLoading] = useState(false); // Track loading state for GitHub data
  
  // Define grid dimensions at component level so they're available to all functions
  const rows = 7;
  const cols = 15;
  
  // The message to be displayed when tapped
  const fullMessage = "Your 3rd challenge (V1) is to make 30min of gameplay, open source your game on GitHub, and publish your game.";
  
  // Effect to fetch GitHub repository data if user has GitHubLink
  useEffect(() => {
    if (userData?.GitHubLink && !repoData) {
      fetchGitHubData(userData.GitHubLink);
    }
    
    // If user hasn't submitted yet, pre-populate the GitHub field with their link
    if (userData?.GitHubLink && !githubLink) {
      setGithubLink(userData.GitHubLink);
    }
  }, [userData]);

  // Function to extract owner and repo name from GitHub URL
  const parseGitHubUrl = (url) => {
    try {
      // Handle different GitHub URL formats
      const urlObj = new URL(url);
      const path = urlObj.pathname.split('/').filter(p => p);
      
      if (path.length >= 2) {
        return {
          owner: path[0],
          repo: path[1]
        };
      }
    } catch (error) {
      console.error("Failed to parse GitHub URL:", error);
    }
    return null;
  };

  // Function to fetch GitHub repository data
  const fetchGitHubData = async (githubUrl) => {
    setIsLoading(true);
    
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Fetch repository information
      const repoResponse = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
      if (!repoResponse.ok) throw new Error('Failed to fetch repository data');
      const repoJson = await repoResponse.json();
      setRepoData(repoJson);
      
      // Fetch commit activity - handle the 202 status that GitHub returns when computing stats
      let statsJson = null;
      let retries = 3;
      
      while (retries > 0) {
        const statsResponse = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/stats/commit_activity`);
        
        if (statsResponse.status === 202) {
          // GitHub is computing the stats, wait and retry
          console.log('GitHub is computing stats, retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries--;
          continue;
        }
        
        if (!statsResponse.ok) throw new Error('Failed to fetch commit activity');
        
        statsJson = await statsResponse.json();
        break;
      }
      
      if (statsJson) {
        console.log('Commit data received:', statsJson);
        setCommitData(statsJson);
      } else {
        // If we couldn't get commit data after retries, try a different endpoint
        console.log('Trying commits endpoint instead...');
        const commitsResponse = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=100`);
        
        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          console.log('Got commits:', commits.length);
          
          // Transform into weekly data structure (simplified)
          const weeklyData = processCommitsIntoWeeklyFormat(commits);
          setCommitData(weeklyData);
        }
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to process commits into a weekly format
  const processCommitsIntoWeeklyFormat = (commits) => {
    // Create a map to count commits by day
    const commitsByDay = {};
    
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!commitsByDay[dateStr]) {
        commitsByDay[dateStr] = 0;
      }
      commitsByDay[dateStr]++;
    });
    
    // Create weekly data in the format GitHub stats API would return
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    // Go back to find the Sunday that started the current week
    const dayOfWeek = startOfToday.getDay();
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - dayOfWeek);
    
    // Go back 14 more weeks to get 15 total weeks
    const startDate = new Date(startOfWeek);
    startDate.setDate(startDate.getDate() - (14 * 7));
    
    const weeklyData = [];
    for (let i = 0; i < 15; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (i * 7));
      
      const days = [];
      let total = 0;
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];
        const count = commitsByDay[dateStr] || 0;
        days.push(count);
        total += count;
      }
      
      weeklyData.push({
        days,
        total,
        week: Math.floor(weekStart.getTime() / 1000) // Unix timestamp for week start
      });
    }
    
    return weeklyData;
  };

  // Typewriter effect for the message
  useEffect(() => {
    if (!isV1Tapped) return;
    
    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullMessage.length) {
        setDisplayText(fullMessage.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true); // Mark typing as complete
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [isV1Tapped]);
  
  // Handle card tap
  const handleCardTap = () => {
    if (!isV1Tapped) {
      setIsV1Tapped(true);
    }
  };
  
  // Define which grid positions form "V1" (row, col)
  const v1Pattern = [
    // V shape (left side)
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 2], [5, 3],
    // V shape (middle/bottom)
    [6, 4],
    // V shape (right side)
    [5, 5], [4, 6], [3, 7], [2, 7], [1, 7], [0, 7],
    // Number 1
    [0, 10], [1, 9], [1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 9], [6, 10], [6, 11]
  ];

  // Animation sequence with simplified pattern alternation - only runs on hover
  useEffect(() => {
    // Don't run animation if not hovering or if already tapped
    if (!isHovering || isV1Tapped) return;
    
    const v1CycleLength = Math.floor(v1Pattern.length * 0.7) + 12; // Longer V1 animation
    const otherPatternCycleLength = 80; // Slower decorative patterns

    const timer = setInterval(() => {
      setAnimationFrame(prevFrame => {
        // Increment the frame counter
        const nextFrame = prevFrame + 1;
        
        // Get current cycle length based on pattern type
        const currentCycleLength = currentPattern === 0 
          ? v1CycleLength 
          : otherPatternCycleLength;
        
        // Check if we've reached the end of a cycle
        if (nextFrame >= currentCycleLength) {
          // Switch patterns at the end of a cycle
          patternCycleRef.current += 1;
          
          // If we just finished showing V1, switch to a random pattern
          if (currentPattern === 0) {
            const randomPattern = Math.floor(Math.random() * 4) + 1;
            setCurrentPattern(randomPattern);
          } else {
            // If we just finished a random pattern, go back to V1
            setCurrentPattern(0);
          }
          
          // Reset frame counter
          return 0;
        }
        
        return nextFrame;
      });
    }, 120); // Much slower animation for more satisfying pacing
    
    return () => clearInterval(timer);
  }, [currentPattern, isHovering, isV1Tapped]); // Add isV1Tapped to dependencies
  
  // Reset animation when hover ends
  useEffect(() => {
    if (!isHovering) {
      setAnimationFrame(0);
      setCurrentPattern(0);
    }
  }, [isHovering]);

  // Helper function for easing
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // Pattern 0: V1 Pattern (base pattern)
  const isV1PatternLit = (row, col, frame) => {
    const positionIndex = v1Pattern.findIndex(pos => pos[0] === row && pos[1] === col);
    if (positionIndex === -1) return false;
    
    const totalSquares = v1Pattern.length;
    const totalAnimationFrames = Math.floor(totalSquares * 0.7) + 12;
    
    // Apply easing to frame progression
    let normalizedFrame = frame / totalAnimationFrames;
    
    // First half is appearance
    if (frame < totalAnimationFrames / 2) {
      // Use ease-in for appearance
      const easedProgress = easeInOutQuad(normalizedFrame * 2);
      const revealIndex = Math.floor(easedProgress * totalSquares);
      return positionIndex <= revealIndex;
    } 
    // Second half is disappearance
    else {
      // Hold full pattern for a moment in the middle
      if (frame < (totalAnimationFrames * 0.6)) {
        return true;
      }
      
      // Use ease-out for disappearance
      const disappearanceProgress = (frame - (totalAnimationFrames * 0.6)) / (totalAnimationFrames * 0.4);
      const easedProgress = easeInOutQuad(disappearanceProgress);
      const fadeIndex = Math.floor(easedProgress * totalSquares);
      return positionIndex >= fadeIndex;
    }
  };
  
  // Pattern 1: Ripple pattern - creates expanding/contracting circles
  const isRipplePatternLit = (row, col, frame) => {
    const centerRow = 3, centerCol = 7;
    // Calculate distance from center
    const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2) * 1.5);
    
    // Create expanding ripple effect
    const ripplePosition = frame % 15; // 0-14
    const rippleWidth = 1.5;
    
    return distance > ripplePosition - rippleWidth && distance < ripplePosition;
  };
  
  // Pattern 2: Digital Rain pattern (replaces diagonal pattern)
  const isRainPatternLit = (row, col, frame) => {
    // Create a column-based "digital rain" effect
    // Each column has droplets falling at different speeds
    
    // Generate a semi-random speed for each column (1-3)
    const columnSpeed = ((col * 7 + 3) % 3) + 1;
    
    // Calculate droplet position for this column
    const dropletPosition = Math.floor((frame * columnSpeed) % (rows * 2));
    
    // Make some columns start later than others for better visual effect
    const columnOffset = (col * 3) % 7;
    
    // Each droplet is 2-3 cells long with a "tail"
    const dropletHead = dropletPosition - columnOffset;
    
    if (row === dropletHead % rows) {
      // Droplet head - brightest
      return true;
    } else if (row === (dropletHead - 1) % rows) {
      // Droplet middle - visible but not as bright
      return frame % 2 === 0; // Flicker effect
    } else if (row === (dropletHead - 2) % rows) {
      // Droplet tail - faintest
      return frame % 3 === 0; // More subtle flicker
    }
    
    return false;
  };
  
  // Pattern 3: Spiral pattern
  const isSpiralPatternLit = (row, col, frame) => {
    const centerRow = 3, centerCol = 7;
    // Calculate angle and distance from center
    const angle = Math.atan2(row - centerRow, col - centerCol);
    const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));
    
    // Create spiral effect
    const spiralPhase = frame % 30;
    const spiralRotations = 2; // How many rotations in the spiral
    
    // Normalize angle to 0-2π
    const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
    const spiralPosition = (normalizedAngle / (2 * Math.PI) * spiralRotations + distance / 10) % 1;
    
    return spiralPosition > (spiralPhase / 30) - 0.1 && spiralPosition < (spiralPhase / 30);
  };
  
  // Pattern 4: Twinkle/random pattern
  const isTwinklePatternLit = (row, col, frame) => {
    // Use a pseudo-random function based on position and frame
    const seed = Math.sin(row * 100 + col * 10 + frame * 0.5) * 10000;
    const random = seed - Math.floor(seed);
    
    return random > 0.7; // Adjust threshold to control density of lit squares
  };

  // Check if a square should be lit in the current animation frame
  const isSquareLit = (row, col) => {
    const frame = animationFrame;
    
    // Select the pattern based on currentPattern
    switch(currentPattern) {
      case 0:
        return isV1PatternLit(row, col, frame);
      case 1:
        return isRipplePatternLit(row, col, frame);
      case 2:
        return isRainPatternLit(row, col, frame);
      case 3:
        return isSpiralPatternLit(row, col, frame);
      case 4:
        return isTwinklePatternLit(row, col, frame);
      default:
        return false;
    }
  };

  // Create a grid programmatically
  const renderGrid = () => {
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const rowSquares = [];
      for (let j = 0; j < cols; j++) {
        const lit = isSquareLit(i, j);
        
        // Get color based on current pattern and position
        let litColor, litBorder;
        
        if (lit) {
          switch(currentPattern) {
            case 0: // V1 Pattern - multiple greens
              // Use different shades of green based on position in the pattern
              const v1Index = v1Pattern.findIndex(pos => pos[0] === i && pos[1] === j);
              if (v1Index < v1Pattern.length / 3) {
                // First third - lighter green
                litColor = "#9AE6B4";
                litBorder = "#38A169";
              } else if (v1Index < (v1Pattern.length * 2) / 3) {
                // Middle third - medium green
                litColor = "#68D391";
                litBorder = "#2F855A";
              } else {
                // Last third - darker green
                litColor = "#38A169";
                litBorder = "#276749";
              }
              break;

            case 1: // Ripple Pattern - rainbow gradient
              const centerRow = 3, centerCol = 7;
              // Calculate distance from center to determine color
              const distance = Math.sqrt(Math.pow(i - centerRow, 2) + Math.pow(j - centerCol, 2));
              // Create a hue based on distance and frame
              const rippleHue = (distance * 30 + animationFrame * 5) % 360;
              litColor = `hsl(${rippleHue}, 80%, 65%)`;
              litBorder = `hsl(${rippleHue}, 80%, 45%)`;
              break;

            case 2: // Digital Rain Pattern - different greens/blues for head/middle/tail
              // Determine position in droplet
              const columnSpeed = ((j * 7 + 3) % 3) + 1;
              const dropletPosition = Math.floor((animationFrame * columnSpeed) % (rows * 2));
              const columnOffset = (j * 3) % 7;
              const dropletHead = dropletPosition - columnOffset;
              
              if (i === dropletHead % rows) {
                // Droplet head - bright cyan
                litColor = "#0BC5EA";
                litBorder = "#0987A0";
              } else if (i === (dropletHead - 1) % rows) {
                // Droplet middle - medium blue
                litColor = "#63B3ED";
                litBorder = "#3182CE";
              } else {
                // Droplet tail - darker blue
                litColor = "#4299E1";
                litBorder = "#2B6CB0";
              }
              break;

            case 3: // Spiral Pattern - color wheel
              const centerRowS = 3, centerColS = 7;
              // Use angle to create a color wheel effect
              const angle = Math.atan2(i - centerRowS, j - centerColS);
              // Normalize angle to 0-2π and convert to hue (0-360)
              const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
              const hue = (normalizedAngle / (2 * Math.PI) * 360 + animationFrame * 2) % 360;
              litColor = `hsl(${hue}, 85%, 60%)`;
              litBorder = `hsl(${hue}, 85%, 40%)`;
              break;

            case 4: // Twinkle Pattern - already multi-color, but enhance intensity
              const twinkleHue = (i * 50 + j * 30 + animationFrame * 5) % 360;
              // Use different saturations based on position to create more variety
              const saturation = 70 + ((i + j) % 3) * 10; // 70%, 80%, or 90% saturation
              const lightness = 50 + ((i * j) % 3) * 10; // 50%, 60%, or 70% lightness
              litColor = `hsl(${twinkleHue}, ${saturation}%, ${lightness}%)`;
              litBorder = `hsl(${twinkleHue}, ${saturation}%, ${Math.max(lightness - 20, 30)}%)`;
              break;

            default:
              litColor = "#38A169"; // Default to green
              litBorder = "#276749";
          }
        } else {
          // Unlit squares
          litColor = "#ebedf0";
          litBorder = "#d1d5da";
        }
        
        rowSquares.push(
          <div 
            key={`${i}-${j}`}
            style={{
              width: 16, 
              height: 16, 
              borderRadius: 4, 
              backgroundColor: litColor, 
              border: "1px solid " + litBorder,
              boxShadow: lit ? "none" : "0 0 4px 1px rgba(255, 255, 255, 0.7)",
            }}
          />
        );
      }
      grid.push(
        <div key={`row-${i}`} style={{display: "flex", flexDirection: "row", gap: 2}}>
          {rowSquares}
        </div>
      );
    }
    return grid;
  };

  // Update the renderCommitGrid function to center around the repo creation date
  const renderCommitGrid = () => {
    if (!commitData || !repoData) return renderGrid(); // Fall back to the original grid if no data
    
    // Process commit data as before to get accurate counts
    const commitCounts = {};
    
    // If we're using the stats/commit_activity endpoint response
    if (Array.isArray(commitData) && commitData.length > 0 && commitData[0].days) {
      commitData.forEach(week => {
        const weekStart = new Date(week.week * 1000); // Convert Unix timestamp to Date
        week.days.forEach((count, dayIndex) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + dayIndex);
          const dateStr = date.toISOString().split('T')[0];
          commitCounts[dateStr] = count;
        });
      });
    }
    
    // Create a simplified grid with the same visual style as before
    const grid = [];
    
    // Get repository creation date
    const repoCreationDate = new Date(repoData.created_at);
    
    // Find the start of the week containing the repo creation date
    const repoCreationDay = repoCreationDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfCreationWeek = new Date(repoCreationDate);
    startOfCreationWeek.setDate(repoCreationDate.getDate() - repoCreationDay);
    startOfCreationWeek.setHours(0, 0, 0, 0);
    
    // Create dates centered around repo creation (showing mostly weeks after creation)
    // We'll show about 2 weeks before and the rest after creation
    const days = [];
    const weeksToShowBefore = 2;
    const totalWeeks = 15;
    
    // Add days from weeks before repo creation
    for (let i = weeksToShowBefore * 7 - 1; i >= 0; i--) {
      const date = new Date(startOfCreationWeek);
      date.setDate(startOfCreationWeek.getDate() - i);
      days.push(date);
    }
    
    // Add days from creation week and after
    for (let i = 0; i < (totalWeeks - weeksToShowBefore) * 7; i++) {
      const date = new Date(startOfCreationWeek);
      date.setDate(startOfCreationWeek.getDate() + i);
      days.push(date);
    }
    
    // Group by week
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    // Create grid with larger squares and no labels
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const rowSquares = [];
      
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        // Get the date from our weeks array if available
        let day = null;
        if (colIndex < weeks.length && rowIndex < weeks[colIndex].length) {
          day = weeks[colIndex][rowIndex];
        }
        
        let commitCount = 0;
        let isRepoCreationDate = false;
        
        if (day) {
          const dateStr = day.toISOString().split('T')[0];
          commitCount = commitCounts[dateStr] || 0;
          // Check if this is the repository creation date
          isRepoCreationDate = 
            repoCreationDate.toISOString().split('T')[0] === dateStr;
        }
        
        // Determine color based on commit count
        let color = '#ebedf0'; // No commits
        let border = '#d1d5da';
        
        if (isRepoCreationDate) {
          color = '#2188ff'; // Blue for creation date
          border = '#1957be';
        } else if (commitCount > 0) {
          if (commitCount <= 3) {
            color = '#9be9a8'; // Light green
            border = '#40c463';
          } else if (commitCount <= 6) {
            color = '#40c463'; // Medium green
            border = '#30a14e';
          } else if (commitCount <= 9) {
            color = '#30a14e'; // Darker green
            border = '#216e39';
          } else {
            color = '#216e39'; // Darkest green
            border = '#194c26';
          }
        }
        
        rowSquares.push(
          <div
            key={`commit-${rowIndex}-${colIndex}`}
            style={{
              width: 16, 
              height: 16, 
              borderRadius: 4, 
              backgroundColor: color, 
              border: "1px solid " + border,
              margin: 1,
            }}
            title={day ? `${commitCount} commits on ${day.toDateString()}` : ''}
          />
        );
      }
      
      grid.push(
        <div key={`row-${rowIndex}`} style={{display: "flex", flexDirection: "row", gap: 2}}>
          {rowSquares}
        </div>
      );
    }
    
    return grid;
  };

  // Handle resetting the component to initial state
  const resetComponent = () => {
    // Remove the reset of tapped state when hovering away
    setIsHovering(false);
    setAnimationFrame(0);
    setCurrentPattern(0);
  };

  // Add a new function specifically for full reset
  const fullReset = () => {
    setIsV1Tapped(false);
    setDisplayText("");
    setTypingComplete(false);
    setIsHovering(false);
    setAnimationFrame(0);
    setCurrentPattern(0);
  };

  // Add this function to handle the submission
  const handleSubmit = async (e) => {
    e.stopPropagation();
    
    // Basic validation
    if (!gameWebsiteUrl.trim()) {
      alert("Please enter your game website URL");
      return;
    }
    
    if (!githubLink.trim()) {
      alert("Please enter your GitHub repository link");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-v1-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: userData.token,
          gameWebsiteUrl,
          githubLink,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        // Update local state to reflect submission
        userData.achievements = [...(userData.achievements || []), 'v1_submitted'];
        userData.GitHubLink = githubLink;
        // Fetch GitHub data for the newly submitted link
        fetchGitHubData(githubLink);
      } else {
        alert(data.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting V1 challenge:', error);
      alert('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine which grid to show based on whether user has GitHubLink
  const determineGridToRender = () => {
    if (userData?.GitHubLink) {
      return renderCommitGrid();
    }
    return renderGrid();
  };

  return (
    <div
      className="panel-pop rainbow-glass-panel"
      style={{
        width: 332,
        marginTop: 8,
        borderRadius: 8,
        padding: 12,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff',
        cursor: isV1Tapped ? 'default' : 'pointer',
        transform: isHovering || isV1Tapped ? 'scaleY(1)' : 'scaleY(1.0)',
        transformOrigin: 'top center',
        transition: 'transform 0.3s ease-in-out',
      }}
      onMouseEnter={() => !isV1Tapped && setIsHovering(true)}
      onMouseLeave={resetComponent}
      onClick={() => !isV1Tapped && setIsV1Tapped(true)}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        {!isV1Tapped ? (
          <>
            <div style={{display: "flex", flexDirection: "column", gap: 2}}>
              {isLoading ? (
                <div style={{
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center",
                  height: "180px"
                }}>
                  Loading GitHub data...
                </div>
              ) : determineGridToRender()}
              
              {userData?.GitHubLink && repoData && (
                <div style={{
                  fontSize: "12px",
                  textAlign: "center",
                  marginTop: "5px",
                  color: "#586069"
                }}>
                  {repoData.name} • Created {new Date(repoData.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {!userData.achievements.includes('v1_submitted') && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card tap handler from firing
                  handleThirdChallengeOpen();
                }}
                style={{
                  padding: '4px 12px',
                  position: "absolute",
                  right: -38,
                  bottom: 48,
                  backgroundColor: '#2dba4e',
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transform: 'rotate(90deg)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                Discover V1
              </button>
            )}
          </>
        ) : (
          // Show animated text when tapped
          <div style={{
            padding: '12px',
            fontSize: '16px',
            lineHeight: '1.4',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            fontFamily: 'monospace',
            color: '#276749',
            position: 'relative',
            height: 'auto',
            width: '100%',
          }}>
            <p style={{ 
              margin: '0 0 12px 0',
              textAlign: 'center' 
            }}>
              {displayText}
            </p>
            
            {/* Show input fields after typing is complete */}
            {typingComplete && (
              <div style={{
                width: '100%',
              }}>
                <div style={{
                  marginBottom: '8px',
                }}>
                  <label 
                    htmlFor="gameWebsite" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}
                  >
                    Game Website (Itch or custom)
                  </label>
                  <input
                    id="gameWebsite"
                    type="text"
                    value={gameWebsiteUrl}
                    onChange={(e) => setGameWebsiteUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #d1d5da',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div style={{
                  marginBottom: '10px',
                }}>
                  <label 
                    htmlFor="githubLink" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}
                  >
                    GitHub Link
                  </label>
                  <input
                    id="githubLink"
                    type="text"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #d1d5da',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div style={{
                  marginTop: '4px',
                }}>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || userData.achievements.includes('v1_submitted')}
                    style={{
                      width: '100%',
                      padding: '6px 16px',
                      backgroundColor: '#2dba4e',
                      color: '#000',
                      border: '2px solid #000',
                      borderRadius: '4px',
                      cursor: isSubmitting || userData.achievements.includes('v1_submitted') ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      opacity: isSubmitting || userData.achievements.includes('v1_submitted') ? 0.7 : 1,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : userData.achievements.includes('v1_submitted') ? 'Submitted' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 