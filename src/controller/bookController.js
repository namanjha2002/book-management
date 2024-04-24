const bookModel = require('../model/book.model')
const validator = require('./validation/validation')

module.exports.addBook = async(req,res)=>{
    
        try {
            const {
              name,
              
              ISBN,
              category,
              author,
              
              publicationYear,
              description,
              pages,
              publisher,
              language,
              price
            } = req.body;
            
            // Validation of name
            if (!validator.isValid(name)) {
              return res.status(400).json({ status: false, message: "Invalid name" });
            }
            
            // Validation of ISBN
            if (!validator.isValid(ISBN)) {
              return res.status(400).json({ status: false, message: "Invalid ISBN" });
            }
            
            // Validation of category
            if (!validator.isValidName(category)) {
              return res.status(400).json({ status: false, message: "Invalid category" });
            }
            
            // Validation of author
            if (!validator.isValidName(author)) {
              return res.status(400).json({ status: false, message: "Invalid author" });
            }
        
           
        
            // Validation of published_date (assuming it's a string)
            if (!validator.isValidNumber(publicationYear)) {
              return res.status(400).json({ status: false, message: "Invalid published date" });
            }
            
            // Validation of description
            if (!validator.isValid(description)) {
              return res.status(400).json({ status: false, message: "Invalid description" });
            }
            
            // Validation of pages
            if (!validator.isValidNumber(pages)) {
              return res.status(400).json({ status: false, message: "Invalid number of pages" });
            }
            
            // Validation of publisher
            if (!validator.isValid(publisher)) {
              return res.status(400).json({ status: false, message: "Invalid publisher" });
            }
        
            // Validation of language
            if (!validator.isValid(language)) {
              return res.status(400).json({ status: false, message: "Invalid language" });
            }

            // Validation of price
            if (!validator.isValidNumber(price)) {
              return res.status(400).json({ status: false, message: "Invalid price" });
            }
        
            
        
            const existingISBN = await bookModel.findOne({ ISBN });
            if (existingISBN) {
              return res.status(400).json({ status: false, message: "ISBN already exists" });
            }
        
            // Create a new book object
            let userId = req.decoded.userId
            
            
            const newBook = new bookModel({
              name,
              userId,
              ISBN,
              category,
              author,
        
              publicationYear,
              description,
              pages,
              publisher,
              language,
              price
            });
    
            // Save the new book to the database
            const savedBook = await newBook.save();
        
            // Sending a success response with the saved book data
            return res.status(201).json({
              status: true,
              message: 'Book created successfully',
              book: savedBook
            });
          }
    
          catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
          }
}


module.exports.getBook = async (req, res) => {
    try {
        
        let query = { userId: req.decoded.userId };

       
        if (req.query.author) {
            query.author = req.query.author;
        }

        if (req.query.publicationYear) {
            
            query.publicationYear = req.query.publicationYear
        }

        

        let getBook = await bookModel.find(query);

        return res.status(200).json({
            success: true,
            message: "Listing of books",
            bookList: getBook
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports.updateBook = async (req, res) => {
    try {
        const bookId = req.body.bookId
        const updateData = req.body;

        // Check if the book exists
        const existingBook = await bookModel.findOne({_id:req.body.bookId})
        if (!existingBook) {
            return res.status(404).json({ status: false, message: "Book not found" });
        }

        // Validate update data
        if (updateData.name && !validator.isValid(updateData.name)) {
            return res.status(400).json({ status: false, message: "Invalid name" });
        }

        if (updateData.ISBN && !validator.isValid(updateData.ISBN)) {
            return res.status(400).json({ status: false, message: "Invalid ISBN" });
        }

        if (updateData.category && !validator.isValidName(updateData.category)) {
            return res.status(400).json({ status: false, message: "Invalid category" });
        }

        if (updateData.author && !validator.isValidName(updateData.author)) {
            return res.status(400).json({ status: false, message: "Invalid author" });
        }

        if (updateData.publicationYear && !validator.isValidNumber(updateData.publicationYear)) {
            return res.status(400).json({ status: false, message: "Invalid published date" });
        }

        if (updateData.description && !validator.isValid(updateData.description)) {
            return res.status(400).json({ status: false, message: "Invalid description" });
        }

        if (updateData.pages && !validator.isValidNumber(updateData.pages)) {
            return res.status(400).json({ status: false, message: "Invalid number of pages" });
        }

        if (updateData.publisher && !validator.isValid(updateData.publisher)) {
            return res.status(400).json({ status: false, message: "Invalid publisher" });
        }

        if (updateData.language && !validator.isValid(updateData.language)) {
            return res.status(400).json({ status: false, message: "Invalid language" });
        }

        if (updateData.price && !validator.isValidNumber(updateData.price)) {
            return res.status(400).json({ status: false, message: "Invalid price" });
        }

        // Update the book
        const updatedBook = await bookModel.findByIdAndUpdate(bookId, updateData, { new: true });

        // Sending a success response with the updated book data
        return res.status(200).json({
            status: true,
            message: 'Book updated successfully',
            book: updatedBook
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you pass the book ID as a URL parameter

        // Check if the book exists
        const existingBook = await bookModel.findById(id);
        if (!existingBook) {
            return res.status(404).json({ status: false, message: "Book not found" });
        }

        // Check if the book belongs to the user (assuming you store the user ID in the book document)
        if (existingBook.userId.toString() !== req.decoded.userId) {
            return res.status(403).json({ status: false, message: "Unauthorized to delete this book" });
        }

        // Delete the book
        await bookModel.findByIdAndDelete(id);

        return res.status(200).json({ status: true, message: "Book deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}