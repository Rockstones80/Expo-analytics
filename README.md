# Expo Analytics Application 📊

A mobile application built with [Expo](https://expo.dev) and [NativeWind](https://www.nativewind.dev/) that displays analytics data for temperature, humidity, and pressure readings.

## Features

- **Dashboard**: View current readings for temperature, humidity, and pressure
- **Analytics**: Interactive graphs showing historical data trends for all parameters
- **History**: Detailed log of all past readings with timestamps
- **Modern UI**: Built with NativeWind (TailwindCSS for React Native)
- **Responsive Design**: Works on various screen sizes

## Tech Stack

- Expo
- React Native
- NativeWind (TailwindCSS)
- React Navigation (Bottom Tabs)
- Victory Native (for charts and graphs)

## Project Structure

```
├── App.js                # Main application entry point with navigation setup
├── screens/              # Screen components
│   ├── DashboardScreen.js  # Main dashboard view
│   ├── AnalyticsScreen.js  # Graphs and charts
│   └── HistoryScreen.js    # Historical data logs
├── components/           # Reusable UI components
├── tailwind.config.js    # TailwindCSS configuration
└── babel.config.js       # Babel configuration with NativeWind plugin
```

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) on your physical device

## Customization

### Adding Real Data

To connect this application to real data sources:

1. Create an API service in the `services` directory
2. Update the screen components to fetch real-time data
3. Implement proper error handling and loading states

### Styling

This project uses NativeWind (TailwindCSS for React Native). To customize the styling:

1. Edit the `tailwind.config.js` file to add custom colors or themes
2. Use TailwindCSS class names directly in your components

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Victory Native Documentation](https://formidable.com/open-source/victory/docs/native/)

## Final Year Project

This application was created as a final year project to demonstrate skills in:

- Mobile application development with React Native
- Data visualization with interactive charts
- Modern UI/UX design principles
- State management in React applications
