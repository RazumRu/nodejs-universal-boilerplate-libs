# @packages/exceptions

This component outlines a structured approach to handling exceptions within your application. 
All custom errors are derived from BaseException, ensuring consistency across error handling.

## Implementation
When creating new errors, inherit from BaseException and provide a unique error code. 
This code helps to categorize and identify exceptions easily. 
Refer to the `exceptions.codes.ts` file for a detailed listing and description of all available error codes.

## Example Usage

```TypeScript
export class ForbiddenException extends BaseException {
  constructor(
    errorCode: string = 'FORBIDDEN',
    description?: string,
    customData?: Record<string, any>,
  ) {
    super(errorCode, 403, {
      description,
      customData,
    });

    this.name = ForbiddenException.name;
  }
}
```
