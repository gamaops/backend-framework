"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JobOperation;
(function (JobOperation) {
    JobOperation[JobOperation["CREATE"] = 0] = "CREATE";
    JobOperation[JobOperation["UPDATE"] = 1] = "UPDATE";
})(JobOperation = exports.JobOperation || (exports.JobOperation = {}));
exports.getJobOperationDate = (job, operation) => {
    if (operation === JobOperation.CREATE) {
        return {
            createdAt: new Date(),
            createdJobId: job.id,
        };
    }
    else if (operation === JobOperation.UPDATE) {
        return {
            updatedAt: new Date(),
            updatedJobId: job.id,
        };
    }
    throw new Error(`Unknown job operation: ${operation} (job id: ${job.id})`);
};
