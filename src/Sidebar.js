import React from 'react';
import AdSense from 'react-adsense';

function Sidebar() { // Optionally accept a position prop
    const adUnit = '7518228825778101';

    // Adjust content and styling based on your needs
    return (
      <>
        <aside className='sidebar'>
          <img src={"/Capture.png"} alt="Advertisement" />
          {/* <AdSense.Google
            client="ca-pub-7518228825778101" // Replace with your AdSense publisher ID
            slot={adUnit}
            format="auto"
            responsive="true"
            layout="in-article"
          /> */}
        </aside>
      </>
      
    );
}

export default Sidebar;