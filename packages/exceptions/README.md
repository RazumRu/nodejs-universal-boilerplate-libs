# @packages/exceptions

Some exceptions with a standardized format. 

All errors inherit from `BaseException`. In order to distinguish between errors, you should pass the `code` parameter to the constructor.
All codes are described in the `exceptions.codes.ts` file.
