import React, { useState, useRef, useEffect } from 'react';

export default function SmartQueueDisplay() {
  const [queues, setQueues] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isRefillMode, setIsRefillMode] = useState(false); 
  const [gridSize, setGridSize] = useState(6); 
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [queues, isRefillMode, gridSize]);

  const handleClearQueue = () => {
    setQueues([]); 
    inputRef.current?.focus(); 
  };

  const handleKeyDown = (e) => {
    if (['*', '/', '+', '-'].includes(e.key)) {
      e.preventDefault(); 
      setIsRefillMode(prev => !prev);
      return;
    }

    if (e.key === 'Enter') {
      const val = inputValue.trim();
      
      if (val.length >= 4) {
        const channelStr = val.substring(0, 1);
        const numStr = val.substring(1); 

        const newQueue = { 
          id: Date.now(),
          number: numStr, 
          channel: channelStr,
          isRefill: isRefillMode 
        };

        setQueues((prev) => [newQueue, ...prev].slice(0, 12));
      }
      setInputValue(''); 
    }
  };

  const QueueCard = ({ data, isNewest }) => {
    // ปรับขนาดฟอนต์ของโหมด 12 ช่อง ให้เลขคิวใหญ่ขึ้นเกือบเท่าตัว!
    const fontSizes = gridSize === 6 ? {
      number: 'clamp(80px, 22vmin, 260px)',     
      channelText: 'clamp(45px, 10vmin, 110px)',  
      channelNum: 'clamp(60px, 14vmin, 160px)',   
      badge: 'clamp(14px, 1.8vmin, 24px)'
    } : {
      number: 'clamp(60px, 18vmin, 220px)',       // อัดให้ใหญ่ขึ้นจาก 12vmin เป็น 18vmin เพดาน 220px
      channelText: 'clamp(28px, 5vmin, 80px)',    // ขยายคำว่ารับยาช่องขึ้นนิดนึงให้สมดุล
      channelNum: 'clamp(40px, 8vmin, 110px)',    // ขยายเลขช่องขึ้นนิดนึง
      badge: 'clamp(12px, 1.5vmin, 18px)'
    };

    if (!data) {
      return (
        <div style={{ 
          backgroundColor: '#ffffff', borderRadius: gridSize === 6 ? '20px' : '12px', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', height: '100%',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '2px dashed #D1D5DB'
        }}>
          <div style={{ fontSize: 'clamp(20px, 3vmin, 40px)', color: '#D1D5DB', fontWeight: 'bold' }}>-- ว่าง --</div>
        </div>
      );
    }

    return (
      <div 
        className={isNewest ? 'card-blink' : ''} 
        style={{ 
          backgroundColor: '#ffffff', borderRadius: gridSize === 6 ? '24px' : '16px', display: 'flex', 
          flexDirection: 'column', height: '100%', boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          overflow: 'hidden', position: 'relative',
          border: isNewest ? '4px solid #EAB308' : '4px solid transparent', 
          zIndex: isNewest ? 10 : 1
        }}
      >
        
        {data.isRefill ? (
          <div style={{
            position: 'absolute', top: gridSize === 6 ? '15px' : '8px', right: gridSize === 6 ? '15px' : '8px',
            backgroundColor: '#991B1B', color: '#ffffff',
            padding: gridSize === 6 ? '8px 20px' : '4px 12px', borderRadius: '50px',
            fontSize: fontSizes.badge, fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(153, 27, 27, 0.4)', zIndex: 5
          }}>
            ด่วน
          </div>
        ) : (
          <div style={{
            position: 'absolute', top: gridSize === 6 ? '15px' : '8px', right: gridSize === 6 ? '15px' : '8px',
            backgroundColor: '#F3F4F6', color: '#6B7280',
            padding: gridSize === 6 ? '8px 20px' : '4px 12px', borderRadius: '50px',
            fontSize: fontSizes.badge, fontWeight: 'bold', zIndex: 5
          }}>
            ปกติ
          </div>
        )}

        {/* ครึ่งบน: เลขคิว */}
        <div style={{ 
          flex: 7, 
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backgroundColor: data.isRefill ? '#FEE2E2' : '#ffffff', 
          position: 'relative', minHeight: 0 
        }}>
          <div style={{ 
            fontSize: fontSizes.number, 
            fontWeight: '900', 
            color: data.isRefill ? '#7F1D1D' : '#1F2937', 
            lineHeight: '1', letterSpacing: '2px',
            // ปรับระยะด้านบนนิดหน่อย เพื่อให้เลขคิว 12 ช่องอยู่กึ่งกลางสวยๆ
            marginTop: gridSize === 6 ? '15px' : '5px' 
          }}>
            {data.number}
          </div>
        </div>
        
        {/* ครึ่งล่าง: รับยาช่อง */}
        <div style={{ 
          flex: 2.5, 
          backgroundColor: '#556B2F', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px',
          minHeight: 0 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: gridSize === 6 ? '15px' : '10px' }}>
            <span style={{ 
              fontSize: fontSizes.channelText, 
              color: '#ffffff', fontWeight: '900',
              textShadow: '3px 3px 6px rgba(0,0,0,0.4)', lineHeight: '0.85'
            }}>
              รับยาช่อง
            </span>
            <span style={{ 
              fontSize: fontSizes.channelNum, 
              color: '#ffffff', fontWeight: '900', 
              textShadow: '3px 3px 6px rgba(0,0,0,0.4)', lineHeight: '0.85' 
            }}>
              {data.channel}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const displayQueues = queues.slice(0, gridSize); 
  
  while (displayQueues.length < gridSize) {
    displayQueues.push(null);
  }

  const gridTemplateColumns = gridSize === 6 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)';
  const gridTemplateRows = gridSize === 6 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';

  return (
    <>
      <style>
        {`
          @keyframes flashBlink {
            0%, 49%, 100% { opacity: 1; }
            50%, 99% { opacity: 0.15; }
          }
          .card-blink {
            animation: flashBlink 1s ease-in-out 3;
            animation-fill-mode: forwards;
          }
        `}
      </style>

      <div style={{ 
        height: '100vh', width: '100vw', backgroundColor: '#E5E7EB', 
        fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', 
        overflow: 'hidden', margin: 0, padding: 0
      }}>
        
        <main style={{ 
          flex: 1, padding: '15px', display: 'grid', gap: '15px',
          gridTemplateColumns: gridTemplateColumns, gridTemplateRows: gridTemplateRows,    
          boxSizing: 'border-box',
          minHeight: 0,
          overflow: 'hidden' 
        }}>
          {displayQueues.map((q, index) => (
            <QueueCard 
              key={q ? q.id : `empty-${index}`} 
              data={q} 
              isNewest={index === 0 && q !== null} 
            />
          ))}
        </main>

        <header style={{ 
          backgroundColor: '#111827', padding: '8px 20px', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.2)', zIndex: 10,
          flexShrink: 0
        }}>
          <h1 style={{ margin: 0, color: '#F9FAFB', fontSize: '18px' }}>ระบบเรียกคิว</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            <button 
              onClick={() => {
                setGridSize(gridSize === 6 ? 12 : 6);
                inputRef.current?.focus();
              }}
              style={{
                padding: '6px 15px', fontSize: '14px', fontWeight: 'bold',
                borderRadius: '6px', cursor: 'pointer', border: '2px solid #6366F1',
                backgroundColor: '#4F46E5', color: '#ffffff',
                transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
            >
              <span>{gridSize === 6 ? '🔳 แสดงผล 12 ช่อง' : '🔲 แสดงผล 6 ช่อง'}</span>
              <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#C7D2FE' }}>
                (เปลี่ยนขนาดจอ)
              </span>
            </button>

            <div style={{ width: '1px', height: '35px', backgroundColor: '#4B5563', margin: '0 5px' }}></div>
            
            <button 
              onClick={() => setIsRefillMode(!isRefillMode)}
              style={{
                padding: '6px 15px', fontSize: '14px', fontWeight: 'bold',
                borderRadius: '6px', cursor: 'pointer', border: '2px solid',
                backgroundColor: isRefillMode ? '#991B1B' : '#374151',
                color: '#ffffff', borderColor: isRefillMode ? '#7F1D1D' : '#4B5563',
                transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
            >
              <span>{isRefillMode ? 'ด่วน' : 'ปกติ'}</span>
              <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#D1D5DB' }}>
                (กด * สลับ)
              </span>
            </button>

            <label style={{ fontSize: '14px', color: '#D1D5DB', fontWeight: 'bold' }}>พิมพ์เลข 4 หลัก:</label>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="1016"
              maxLength={4}
              style={{
                padding: '6px 15px', fontSize: '20px', borderRadius: '6px', 
                border: '2px solid', borderColor: isRefillMode ? '#991B1B' : '#4B5563', 
                backgroundColor: '#1F2937', color: '#F9FAFB', outline: 'none', 
                width: '120px', fontWeight: 'bold', textAlign: 'center', letterSpacing: '2px'
              }}
            />

            <div style={{ width: '1px', height: '35px', backgroundColor: '#4B5563', margin: '0 5px' }}></div>

            <button 
              onClick={handleClearQueue}
              style={{
                padding: '6px 15px', fontSize: '14px', fontWeight: 'bold',
                borderRadius: '6px', cursor: 'pointer', border: '2px solid #4B5563',
                backgroundColor: '#1F2937', color: '#F87171', 
                transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
            >
              <span>🧹 ล้างคิว</span>
              <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#9CA3AF' }}>
                (Clear)
              </span>
            </button>

          </div>
        </header>
        
      </div>
    </>
  );
}