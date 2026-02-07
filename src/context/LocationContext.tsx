'use client';

import * as React from 'react';

interface LocationContextType {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
}

const LocationContext = React.createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<{
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    isLoading: boolean;
  }>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: false,
  });

  const requestLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation not supported',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState({
          latitude,
          longitude,
          error: null,
          isLoading: false,
        });
        // Save to session storage to persist during session
        sessionStorage.setItem(
          'user_location',
          JSON.stringify({ latitude, longitude })
        );
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  // Try to load from session storage on mount or request fresh
  React.useEffect(() => {
    const saved = sessionStorage.getItem('user_location');
    if (saved) {
      try {
        const { latitude, longitude } = JSON.parse(saved);
        setState((prev) => ({ ...prev, latitude, longitude }));
      } catch (e) {
        console.error('Failed to parse saved location', e);
        requestLocation();
      }
    } else {
      requestLocation();
    }
  }, [requestLocation]);

  const contextValue = React.useMemo(
    () => ({
      ...state,
      requestLocation,
    }),
    [state, requestLocation]
  );

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = React.useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
