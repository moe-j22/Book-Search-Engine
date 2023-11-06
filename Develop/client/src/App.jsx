import './App.css';
import { ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache } from '@apollo/client';

import Navbar from './components/Navbar';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ApolloProvider>
  );
}

export default App;
