import timelessLogo from "../assets/timeless.png";
import { connectWallet } from "../Blockchain.services";
import { SESSION_STORAGE_KEY } from "../lib/constants";
import { useGlobalState, shortenWalletAddress, setGlobalState } from "../store";

const Header = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");

  const handleScrollToComponent = (event: any, elementId: string) => {
    event.preventDefault(); // Prevent the default anchor behavior
    const element = document.getElementById(elementId);
    if (element) {
      smoothScrollTo(element);
    }
  };

  const smoothScrollTo = (target: any) => {
    const elementPosition = 180;
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition - elementPosition;
    const duration = 800; // Adjust this value to control the scroll duration
    let startTime: any = null;

    const step = (currentTime: any) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      window.scrollTo(
        0,
        easeInOutCubic(progress, startPosition, distance, duration)
      );
      if (progress < duration) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // Easing function for smooth scrolling
  const easeInOutCubic = (t: any, b: any, c: any, d: any) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  };

  const handleLogout = () => {
    // Clear the account from sessionStorage
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setGlobalState("connectedAccount", null);
  };

  return (
    <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img
          className="w-32 cursor-pointer"
          src={timelessLogo}
          alt="Timeless Logo"
        />
      </div>

      {connectedAccount && (
        <ul
          className="md:flex-[0.5] text-white md:flex
        hidden list-none flex-row justify-between 
        items-center flex-initial mr-20"
        >
          <li className="mx-4 cursor-pointer hover:text-xl hover:font-bold">
            <a
              href="#myArtworks"
              onClick={(event) => handleScrollToComponent(event, "myArtworks")}
            >
              My Artworks
            </a>
          </li>
          <li className="mx-4 cursor-pointer hover:text-xl hover:font-bold">
            <a
              href="#artworks"
              onClick={(event) => handleScrollToComponent(event, "artworks")}
            >
              Artworks
            </a>
          </li>
          <li className="mx-4 cursor-pointer hover:text-xl hover:font-bold">
            <a
              href="#transactions"
              onClick={(event) =>
                handleScrollToComponent(event, "transactions")
              }
            >
              Transactions
            </a>
          </li>
        </ul>
      )}

      {connectedAccount ? (
        <>
          <button
            className="shadow-xl shadow-black text-white
          bg-[#e32970] hover:bg-[#bd255f] md:text-md p-2
          rounded-full cursor-pointer"
          >
            {shortenWalletAddress(connectedAccount, 4, 4, 11)}
          </button>
          <button
            className="shadow-xl shadow-black text-white
           hover:bg-[#490c0c] md:text-md p-2
          rounded-full cursor-pointer mx-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <button
          className="shadow-xl shadow-black text-white
        bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
          rounded-full cursor-pointer"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default Header;
