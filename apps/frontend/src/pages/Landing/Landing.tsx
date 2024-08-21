import { useQuery } from '@tanstack/react-query';

import './Landing.scss';

const apiHealthEndpoint = '/api/healthz';

function Landing() {
  const healthQuery = useQuery({
    queryKey: ['api_health'],
    queryFn: () => fetch(apiHealthEndpoint),
  });

  return (
    <>
      <h1>Hello World!</h1>
      <p>API Status: {healthQuery.data?.status === 200 ? 'Online' : 'Offline'}</p>
    </>
  );
}

export default Landing;
