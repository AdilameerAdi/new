const apiConfig = () => {
  return {
    endpoint: `${
      import.meta.env.VITE_API_URL
    }/api/v1`,
    websocket: import.meta.env.VITE_WS_URL,
    axios: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          'authToken',
        )}`,
      },
    },
  };
};

export default apiConfig;
