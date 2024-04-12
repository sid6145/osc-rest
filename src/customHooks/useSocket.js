import moment from "moment/moment";
import { SOCKET_BASE_URL, WEBSOCKET_PROTOCOL, DEVICE_TYPE } from "../constants";
import { useDispatch } from "react-redux";
import {
  setProductDetails,
  setCategories,
  fetchDashboardData,
  setCartData,
  handleIsSocketConnected,
} from "../redux/dashboardSlice";
let socket = null;
let hbInterval = null;
let msgReceivedInterval = null;
let setTimeStamp =  moment().format();
let currentTime = moment().format();

const useSocket = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const headers = [
    WEBSOCKET_PROTOCOL,
    userData.userId,
    userData.sessionId,
    DEVICE_TYPE,
  ];
  const dispatch = useDispatch();

  const sendMessage = (payload) => {
    socket.send(JSON.stringify(payload));
  };

  const connectWebsocket = () => {
    socket = new WebSocket(SOCKET_BASE_URL, headers);
  };


  const handleHeartBeats = () => {
    if (hbInterval) {
      clearInterval(hbInterval);
    }
    hbInterval = setInterval(() => {
      sendMessage({ MT: "ping" });
    }, 10000);
  };

  const closeConnection = async () => {
    socket.close();
    clearInterval(hbInterval);
    clearInterval(msgReceivedInterval);
    window.location.reload();
    localStorage.clear();
  };

  const handleReconnect = () => {
    clearInterval(hbInterval);
    if(socket.readyState === WebSocket.OPEN) {
       socket.close();
    } else {
      setTimeStamp = moment().format();
    }
    dispatch(handleIsSocketConnected(false));
    startConnection();
  };

  const startConnection = async () => {
    connectWebsocket();
    socket.onopen = (event) => {
      if (socket.readyState === 1) {
        console.log(":::::THE SOCKET IS OPEN!:::::");
        setTimeStamp = moment().format();
        dispatch(handleIsSocketConnected(true));
        handleHeartBeats();
        msgReceivedInterval = setInterval(() => {
          currentTime = moment().format();
          const diff = moment(currentTime).diff(setTimeStamp) / 1000;
          if (diff > 30 && socket.readyState !== WebSocket.OPEN) {
            handleReconnect();
          }
          if (diff > 120) {
            closeConnection();
          }
        }, 5000);
      }
    };

    socket.onmessage = (event) => {
      setTimeStamp = moment().format();
      const data = JSON.parse(event.data);
      switch (data.MT) {
        case "2":
          dispatch(setProductDetails(data));
          break;
        case "3":
          dispatch(setCategories(data.products));
          break;
        case "6":
          dispatch(
            setCartData(data?.cartProducts?.length ? data.cartProducts : [])
          );
          break;
        case "11":
          dispatch(
            fetchDashboardData(
              data?.dataObject?.data?.length ? data.dataObject.data : []
            )
          );
          break;
        default:
          break;
      }
    };

    socket.onerror = (error) => {
      dispatch(handleIsSocketConnected(false));
      console.log("error::::", error);
    };

    socket.onclose = () => {
      // dispatch(handleIsSocketConnected(false));
      console.log("SOCKET CLOSED:::");
    };
  };

  return {
    startConnection,
    closeConnection,
    sendMessage,
    socket,
  };
};

export default useSocket;
