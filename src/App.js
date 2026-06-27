import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IndexPage from "./components/IndexPage";
import RechargePage from "./components/RechargePage";
import ProcessingPage from "./components/ProcessingPage";
import PaymentFailed from "./components/PaymentFailed";
import { FacebookPixel } from "./components/services/FacebookPixel";

function App() {
  React.useEffect(() => {
    FacebookPixel(); // Load the Facebook pixel
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/recharge/:number/:selectedOption" element={<RechargePage />} />
        <Route path="/processing" element={<ProcessingPage />} /> {/* Add this new route */}
        <Route path="/failed" element={<PaymentFailed />} />
      </Routes>
    </Router>
  );
}

export default App;