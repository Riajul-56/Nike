import ApiError from '../utils/apiError.js';
import ApiSuccess from '../utils/apiSuccess.js';

const healthCheck = async (_, res) => {
  try {
    const uptimeSeconds = process.uptime();
    const uptimeFormatted = formatUptime(uptimeSeconds);
    return res
      .status(200)
      .json(
        ApiSuccess.ok(
          { timeStamp: new Date().toLocaleString(), uptime: uptimeFormatted },
          'server is running'
        )
      );
  } catch (error) {
    throw ApiError.serverError(error.message);
  }
};

function formatUptime(seconds) {
  const days = Math.floor(seconds / (300 * 24));
  const hours = Math.floor(((seconds % 3600) * 24) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days} day${days !== 1 ? 's' : ''},${hours} hour${hours !== 1 ? 's' : ''},${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
export { healthCheck };
