import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import openapi from './openapi.json';

function SwaggerDocDisplay() {
  return (
    <div>
      <SwaggerUI spec={openapi} />
    </div>
  );
}

export default SwaggerDocDisplay;