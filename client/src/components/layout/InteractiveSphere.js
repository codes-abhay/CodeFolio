import React, { useEffect, useRef } from 'react';

const InteractiveSphere = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle resize and grid initialization
    let particles = [];
    const spacing = 32; // Grid cell size in pixels

    const initGrid = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      particles = [];
      // Generate flat 2D grid covering the entire screen
      for (let x = spacing / 2; x < canvas.width; x += spacing) {
        for (let y = spacing / 2; y < canvas.height; y += spacing) {
          particles.push({
            baseX: x,
            baseY: y,
            x: x,
            y: y,
            angle: 0
          });
        }
      }
    };

    initGrid();
    window.addEventListener('resize', initGrid);

    // Mouse coordinates (default to center of screen)
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Eased mouse coordinates (creates physics inertia)
    let easeX = targetX;
    let easeY = targetY;

    // Animation Loop
    const draw = () => {
      // Clear canvas with trail blur (creates clean motion trails)
      ctx.fillStyle = 'rgba(6, 8, 12, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Smoothly ease the cursor tracking center
      easeX += (targetX - easeX) * 0.075;
      easeY += (targetY - easeY) * 0.075;

      const time = Date.now() * 0.0012;
      const activeRadius = 220; // Radius of the interactive colorful bubble

      particles.forEach((p) => {
        // Calculate distance from grid particle to the eased cursor
        const dx = p.baseX - easeX;
        const dy = p.baseY - easeY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Subtle wiggling wave offset (ripple effect)
        const wave = Math.sin(time * 2.5 + dist * 0.015) * 4.5;
        const angleToMouse = Math.atan2(dy, dx);

        // Apply grid displacement
        p.x = p.baseX + Math.cos(angleToMouse) * wave;
        p.y = p.baseY + Math.sin(angleToMouse) * wave;

        // Determine if particle falls inside the active cursor bubble
        if (dist < activeRadius) {
          // Circumferential alignment: Align the dash perpendicular to the cursor vector.
          // This makes the dashes form concentric rings, creating a 3D sphere illusion.
          const tangentAngle = angleToMouse + Math.PI / 2;

          // Scale dash length and width based on proximity to center
          const proximityRatio = 1 - dist / activeRadius; // 1 at center, 0 at boundary
          const dashLength = 4 + proximityRatio * 9; // ranges 4px to 13px
          const lineWidth = 1 + proximityRatio * 1.2; // ranges 1px to 2.2px

          // Dynamic opacity fading toward the outer boundary
          const opacity = Math.max(0.15, Math.min(0.9, proximityRatio * 1.5));

          // Assign colors based on quadrant relative to the cursor (Indigo, Violet, Lavender, White)
          let color = `rgba(224, 231, 255, ${opacity})`; // Soft White-Indigo
          if (dx < -30 && dy < 15) {
            color = `rgba(99, 102, 241, ${opacity})`; // Royal Indigo
          } else if (dx > 30 && dy < 15) {
            color = `rgba(124, 58, 237, ${opacity})`; // Deep Violet
          } else if (dy > 30) {
            color = `rgba(165, 180, 252, ${opacity})`; // Soft Lavender
          }

          // Draw active colorful dash
          const startX = p.x - Math.cos(tangentAngle) * (dashLength / 2);
          const startY = p.y - Math.sin(tangentAngle) * (dashLength / 2);
          const endX = p.x + Math.cos(tangentAngle) * (dashLength / 2);
          const endY = p.y + Math.sin(tangentAngle) * (dashLength / 2);

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        } else {
          // Draw standard ambient background particles (tiny static grey dashes)
          ctx.beginPath();
          // Subtle rotation for background elements
          const bgAngle = time * 0.15 + (p.baseX * 0.05 + p.baseY * 0.05);
          const bgLength = 3;

          const startX = p.x - Math.cos(bgAngle) * (bgLength / 2);
          const startY = p.y - Math.sin(bgAngle) * (bgLength / 2);
          const endX = p.x + Math.cos(bgAngle) * (bgLength / 2);
          const endY = p.y + Math.sin(bgAngle) * (bgLength / 2);

          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', initGrid);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-sphere-canvas" />;
};

export default InteractiveSphere;
