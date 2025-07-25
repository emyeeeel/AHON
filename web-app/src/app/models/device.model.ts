export interface DeviceData {
    id: number;
    location: {
      lat: number;
      lon: number;
    };
    is_active: boolean;
    camera_radius: {
      actual_radius: number;
      display_radius: number;
    };
    timestamp: string;
  }
  
  export interface DeviceApiResponse {
    devices: DeviceData[];
  }