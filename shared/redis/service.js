const { createClient } = require("redis");
const Queue = require("bull");
const config = require("../config");
const logger = require("../logger");
const emailService = require("../email");

class RedisService {
  constructor() {
    this.client = createClient({
      username: "default",
      password: config.redis.pass,
      socket: {
        host: config.redis.host,
        port: config.redis.port,
        tls: config.redis.tls,
      },
    });
    this.client.on("error", (err) => logger.error("Redis Error", err));
    this.client
      .connect()
      .then(() => logger.info(" Connected to Redis"))
      .catch((err) => logger.error("Redis connection failed", err));
    this.emailQueue = new Queue("emailQueue", {
      redis: {
        host: config.redis.host,
        password: config.redis.pass,
        port: config.redis.port,
        tls: config.redis.tls,
      },
    });

    this.emailQueue.process(async (job) => {
      const { to, type, code, verificationType, message } = job.data;
      if (type === "verification" && verificationType) {
        await emailService.otpMail({ to, code, verificationType });
      }
      if (type === "signup") {
        await emailService.sendSignUpMail({ to, code });
      }
      
      if (type === "resetSuccess") {
        await emailService.resetPasswordSuccess({ to });
      }

      if (!type) {
        await emailService.sendMail({
          to,
          subject: message.subject,
          text: message.text,
          html: `<p>${message.text}</p>`
        })
      }
    });

    this.emailQueue.on("failed", (job, error) => {
      logger.error(`Email job failed: ${job.id}`, error);
    });
  }
  async enqueuemail({ to, type, code = null, verificationType = null , message = null}) {
    await this.emailQueue.add({ to, type, code, verificationType, message });
    logger.info(` Email job enqueued for: ${to}`);
  }
}
module.exports = new RedisService();
