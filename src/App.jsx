import React, { useState, useRef, useEffect } from 'react';

export default function SmartQueueDisplay() {
  const [queues, setQueues] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isRefillMode, setIsRefillMode] = useState(false); 
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [queues, isRefillMode]);

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
          id: Date.now(), // ใช้เวลาปัจจุบันเป็น ID เพื่อบังคับให้ React วาดการ์ดใหม่ทุกครั้งที่กด
          number: numStr, 
          channel: channelStr,
          isRefill: isRefillMode 
        };

        setQueues((prev) => [newQueue, ...prev].slice(0, 6));
      }
      setInputValue(''); 
    }
  };

  const QueueCard = ({ data, isNewest }) => {
    if (!data) {
      return (
        <div style={{ 
          backgroundColor: '#ffffff', borderRadius: '20px', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', height: '100%',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '2px dashed #D1D5DB'
        }}>
          <div style={{ fontSize: 'clamp(30px, 4vw, 50px)', color: '#D1D5DB', fontWeight: 'bold' }}>-- ว่าง --</div>
        </div>
      );
    }

    return (
      <div 
        className={isNewest ? 'card-blink' : ''} // ถ้าเป็นการ์ดใบใหม่สุด ให้ใส่คลาสกะพริบ
        style={{ 
          backgroundColor: '#ffffff', borderRadius: '24px', display: 'flex', 
          flexDirection: 'column', height: '100%', boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          overflow: 'hidden', position: 'relative',
          border: isNewest ? '4px solid #EAB308' : '4px solid transparent', // กรอบทองเฉพาะคิวล่าสุด
          zIndex: isNewest ? 10 : 1
        }}
      >
        
        {data.isRefill ? (
          <div style={{
            position: 'absolute', top: '15px', right: '15px',
            backgroundColor: '#991B1B', 
            color: '#ffffff',
            padding: '5px 15px', borderRadius: '50px',
            fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(153, 27, 27, 0.4)', zIndex: 5
          }}>
             คิวด่วน
          </div>
        ) : (
          <div style={{
            position: 'absolute', top: '15px', right: '15px',
            backgroundColor: '#F3F4F6', color: '#6B7280',
            padding: '5px 15px', borderRadius: '50px',
            fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 'bold', zIndex: 5
          }}>
            คิวปกติ
          </div>
        )}

        {/* ครึ่งบน: เลขคิวหลัก */}
        <div style={{ 
          flex: 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center',
          backgroundColor: data.isRefill ? '#FEE2E2' : '#ffffff', 
          position: 'relative'
        }}>
          <div style={{ 
            fontSize: 'clamp(100px, 14vw, 190px)', 
            fontWeight: '900', 
            color: data.isRefill ? '#7F1D1D' : '#1F2937', 
            lineHeight: '1', letterSpacing: '2px',
            marginTop: '10px' 
          }}>
            {data.number}
          </div>
        </div>
        
        {/* ครึ่งล่าง: ช่องบริการ */}
        <div style={{ 
          flex: 0.8, backgroundColor: '#556B2F', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <span style={{ 
              fontSize: 'clamp(45px, 6vw, 90px)', 
              color: '#ffffff', fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              ช่องบริการ
            </span>
            <span style={{ 
              fontSize: 'clamp(80px, 11.2vw, 150px)', 
              color: '#ffffff', fontWeight: '900', 
              textShadow: '3px 3px 6px rgba(0,0,0,0.4)', 
              lineHeight: '0.9' 
            }}>
              {data.channel}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const displayQueues = [...queues];
  while (displayQueues.length < 6) {
    displayQueues.push(null);
  }

  return (
    <>
      {/* แทรก CSS Animation ตรงนี้ให้ระบบกะพริบทำงานได้ชัวร์ 100% */}
      <style>
        {`
          @keyframes flashBlink {
            0%, 49%, 100% { opacity: 1; }
            50%, 99% { opacity: 0.15; }
          }
          .card-blink {
            animation: flashBlink 1s ease-in-out 3; /* กะพริบ 1 วินาที ทำ 3 รอบ */
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
          gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)',    
          boxSizing: 'border-box'
        }}>
          {displayQueues.map((q, index) => (
            // key={q.id} สำคัญมาก เพราะมันบังคับให้ React วาดการ์ดใบใหม่ ทำให้ Animation เล่นใหม่ทุกครั้งที่กด Enter
            <QueueCard 
              key={q ? q.id : `empty-${index}`} 
              data={q} 
              isNewest={index === 0 && q !== null} // เช็คว่าเป็นใบแรกสุด (ซ้ายบน) หรือไม่
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
          </div>
        </header>
        
      </div>
    </>
  );
}