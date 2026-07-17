declare const navigator: {
  onLine: boolean;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
};

export async function isConnected(): Promise<boolean> {
  return navigator.onLine;
}

export function onConnectivityChange(callback: (connected: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  navigator.addEventListener('online', handleOnline);
  navigator.addEventListener('offline', handleOffline);
  return () => {
    navigator.removeEventListener('online', handleOnline);
    navigator.removeEventListener('offline', handleOffline);
  };
}
