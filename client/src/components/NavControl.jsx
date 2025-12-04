      
      
    export function NavControl({ onLogout }) {
        
    return (
        <>
    
      <div className="data-control-item">
        <button onClick={onLogout} className="nav-button home-button">
          [HOME]
        </button>
        <button onClick={onLogout} className="nav-button logout-button">
          [LOGOUT]
        </button>

      </div>
      </>
    );

    }