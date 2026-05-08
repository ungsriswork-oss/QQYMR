import React, { useState, useRef, useEffect } from 'react';

export default function SmartQueueDisplay() {
  const [queues, setQueues] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isRefillMode, setIsRefillMode] = useState(false); 
  const [gridSize, setGridSize] = useState(6); // State สำหรับกำหนดจำนวนช่อง (6 หรือ 12)
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

        // ตัด array ตามจำนวนช่องที่เลือกไว้ (gridSize)
        setQueues((prev) => [newQueue, ...prev].slice(0, gridSize));
      }
      setInputValue(''); 
    }
  };

  const QueueCard = ({ data, isNewest }) => {
    // กำหนดขนาดฟอนต์ตามจำนวนช่อง (ถ้า 12 ช่อง ฟอนต์จะเล็กลงครึ่งนึง)
    const fontSizes = gridSize === 6 ? {
      number: 'clamp(100px, 14vw, 190px)',
      channelText: 'clamp(45px, 6vw, 90px)',
      channelNum: 'clamp(80px, 11.2vw, 150px)',
      badge: 'clamp(14px, 1.5vw, 20px)'
    } : {
      number: 'clamp(60px, 8vw, 110px)',
      channelText: 'clamp(24px, 3vw, 50px)',
      channelNum: 'clamp(50px, 6vw, 85px)',
      badge: 'clamp(10px, 1vw, 14px)'
    };

    if (!data) {
      return (
        <div style={{ 
          backgroundColor: '#ffffff', borderRadius: gridSize === 6 ? '20px' : '12px', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', height: '100%',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '2px dashed #D1D5DB'
        }}>
          <div style={{ fontSize: 'clamp(20px, 3vw, 40px)', color: '#D1D5DB', fontWeight: 'bold' }}>-- ว่าง --</div>
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
            padding: gridSize === 6 ? '5px 15px' : '3px 10px', borderRadius: '50px',
            fontSize: fontSizes.badge, fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(153, 27, 27, 0.4)', zIndex: 5
          }}>
            💊 คิวรีฟิลยา
          </div>
        ) : (
          <div style={{
            position: 'absolute', top: gridSize === 6 ? '15px' : '8px', right: gridSize === 6 ? '15px' : '8px',
            backgroundColor: '#F3F4F6', color: '#6B7280',
            padding: gridSize === 6 ? '5px 15px' : '3px 10px', borderRadius: '50px',
            fontSize: fontSizes.badge, fontWeight: 'bold', zIndex: 5
          }}>
            คิวปกติ
          </div>
        )}

        <div style={{ 
          flex: 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center',
          backgroundColor: data.isRefill ? '#FEE2E2' : '#ffffff', 
          position: 'relative'
        }}>
          <div style={{ 
            fontSize: fontSizes.number, 
            fontWeight: '900', 
            color: data.isRefill ? '#7F1D1D' : '#1F2937', 
            lineHeight: '1', letterSpacing: '2px',
            marginTop: '10px' 
          }}>
            {data.number}
          </div>
        </div>
        
        <div style={{ 
          flex: 0.8, backgroundColor: '#556B2F', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <span style={{ 
              fontSize: fontSizes.channelText, 
              color: '#ffffff', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              ช่องบริการ
            </span>
            <span style={{ 
              fontSize: fontSizes.channelNum, 
              color: '#ffffff', fontWeight: '900', textShadow: '3px 3px 6px rgba(0,0,0,0.4)', lineHeight: '0.9' 
            }}>
              {data.channel}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const displayQueues = [...queues];
  while (displayQueues.length < gridSize) {
    displayQueues.push(null);
  }

  // คำนวณ Columns และ Rows ตามจำนวน Grid Size
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
          boxSizing: 'border-box'
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
          boxShadow: '0 -2px 10px rgba(0,0,0,0.2)', zIndex: 10
        }}>
          <h1 style={{ margin: 0, color: '#F9FAFB', fontSize: '18px' }}>ระบบเรียกคิว</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            {/* ปุ่มเปลี่ยนโหมดแสดงผล (6 หรือ 12 ช่อง) */}
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
              <span>{isRefillMode ? '💊 โหมด: รีฟิลยา' : 'โหมด: คิวปกติ'}</span>
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