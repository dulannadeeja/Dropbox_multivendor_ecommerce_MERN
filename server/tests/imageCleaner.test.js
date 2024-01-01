const fs = require('fs');
const path = require('path'); // Add this line
const clearImage = require('../utils/imageCleaner'); // Update with the correct path

describe('clearImage function', () => {
    let filePath;

    beforeEach(() => {
        // Create a temporary file for testing
        const tempFileName = 'test-image.jpg';
        filePath = path.join(__dirname, '..', 'uploads', 'images', tempFileName);
        fs.writeFileSync(filePath, 'Test image content');
    });

    afterEach(() => {
        // Delete the temporary file after each test
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    it('should clear an existing image file', done => {
        clearImage('uploads/images/test-image.jpg');

        // Check if the file is deleted
        setTimeout(() => {
            expect(fs.existsSync(filePath)).toBe(false);
            done();
        }, 1000); // Adjust the timeout as needed
    });

    it('should handle clearing a non-existing image file', done => {
        // Clear the image that was created in beforeEach
        clearImage('uploads/images/non-existing-image.jpg');

        // Check if the file does not exist (should not throw an error)
        setTimeout(() => {
            expect(fs.existsSync(filePath)).toBe(true);
            done();
        }, 1000); // Adjust the timeout as needed
    });
});
