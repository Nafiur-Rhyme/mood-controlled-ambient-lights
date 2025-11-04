from models import LightState
from typing import Optional

class LightController:
    """
    Abstract light controller - implement specific light system here
    This is a mock implementation for Day 1 testing
    """
    
    def __init__(self):
        """Initialize the light controller"""
        self.current_state: Optional[LightState] = None
        print("Light controller initialized (Mock Mode)")
        print("Replace this with your actual light control implementation")
    
    def set_light(self, light_state: LightState):
        """
        Set the light to a specific state
        
        Args:
            light_state: LightState object with color, brightness, transition_speed
        """
        self.current_state = light_state
        
        # Mock implementation - just print to console
        print(f"[LIGHT] Setting light: Color={light_state.color}, "
              f"Brightness={light_state.brightness}%, "
              f"Transition={light_state.transition_speed}s")
        
        # TODO: Implement actual light control based on your hardware
        # Examples for different systems:
        
        # For Philips Hue:
        # self._control_philips_hue(light_state)
        
        # For Arduino/ESP8266:
        # self._control_arduino(light_state)
        
        # For LIFX:
        # self._control_lifx(light_state)
    
    def _control_philips_hue(self, light_state: LightState):
        """Example implementation for Philips Hue"""
        # import requests
        # bridge_ip = "YOUR_BRIDGE_IP"
        # api_key = "YOUR_API_KEY"
        # light_id = 1
        # 
        # # Convert hex color to HSV for Hue
        # h, s, v = self._hex_to_hsv(light_state.color)
        # 
        # data = {
        #     "on": True,
        #     "bri": int(light_state.brightness * 2.54),  # 0-254
        #     "hue": int(h * 65535 / 360),  # 0-65535
        #     "sat": int(s * 254 / 100),     # 0-254
        #     "transitiontime": int(light_state.transition_speed * 10)  # deciseconds
        # }
        # 
        # url = f"http://{bridge_ip}/api/{api_key}/lights/{light_id}/state"
        # requests.put(url, json=data)
        pass
    
    def _control_arduino(self, light_state: LightState):
        """Example implementation for Arduino via Serial"""
        # import serial
        # ser = serial.Serial('/dev/ttyUSB0', 9600)
        # 
        # # Parse hex color to RGB
        # r, g, b = self._hex_to_rgb(light_state.color)
        # 
        # # Apply brightness
        # r = int(r * light_state.brightness / 100)
        # g = int(g * light_state.brightness / 100)
        # b = int(b * light_state.brightness / 100)
        # 
        # # Send to Arduino
        # command = f"{r},{g},{b}\n"
        # ser.write(command.encode())
        pass
    
    def _control_lifx(self, light_state: LightState):
        """Example implementation for LIFX"""
        # from lifxlan import LifxLAN
        # lifx = LifxLAN()
        # devices = lifx.get_lights()
        # 
        # if devices:
        #     light = devices[0]
        #     h, s, v = self._hex_to_hsv(light_state.color)
        #     
        #     # LIFX uses 0-65535 for HSV
        #     light.set_color([
        #         int(h * 65535 / 360),
        #         int(s * 65535 / 100),
        #         int(light_state.brightness * 65535 / 100),
        #         3500  # Kelvin
        #     ], duration=int(light_state.transition_speed * 1000))
        pass
    
    def _hex_to_rgb(self, hex_color: str) -> tuple:
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def _hex_to_hsv(self, hex_color: str) -> tuple:
        """Convert hex color to HSV tuple"""
        import colorsys
        r, g, b = self._hex_to_rgb(hex_color)
        h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
        return (h * 360, s * 100, v * 100)
    
    def get_current_state(self) -> Optional[LightState]:
        """Get the current light state"""
        return self.current_state


# For testing
if __name__ == "__main__":
    controller = LightController()
    
    # Test different light states
    test_states = [
        LightState(color="#FFD700", brightness=100, transition_speed=1.0),  # Gold
        LightState(color="#4169E1", brightness=50, transition_speed=2.0),   # Blue
        LightState(color="#FF0000", brightness=80, transition_speed=0.5),   # Red
    ]
    
    import time
    for state in test_states:
        controller.set_light(state)
        time.sleep(2)