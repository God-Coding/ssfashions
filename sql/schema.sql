CREATE TABLE Sarees (
    SareeID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    ImageURL NVARCHAR(MAX),
    UploadDate DATETIME DEFAULT GETDATE(),
    PurchaseCount INT DEFAULT 0,
    Description NVARCHAR(MAX)
);

INSERT INTO Sarees (Name, Price, ImageURL, Description, PurchaseCount) VALUES 
('Royal Banarasi Silk', 12500.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Traditional red Banarasi silk saree with intricate gold zari work.', 150),
('Kanjivaram Gold Weave', 18000.00, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 'Luxurious Kanjivaram saree in deep maroon with pure gold weave.', 85),
('Chanderi Cotton Silk', 4500.00, 'https://images.unsplash.com/photo-1583391733958-e026b1346375?w=800&q=80', 'Lightweight and elegant Chanderi saree, perfect for summer occasions.', 42),
('Mysore Silk Crepe', 8900.00, 'https://images.unsplash.com/photo-1610030469668-965d05a1b9f5?w=800&q=80', 'Soft and smooth Mysore silk saree with geometric prints.', 67),
('Paithani Peacock Design', 22000.00, 'https://images.unsplash.com/photo-1610030469841-29e71953d63d?w=800&q=80', 'Exquisite Paithani saree featuring traditional peacock motifs on the pallu.', 25);

-- Users table for authentication
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Name NVARCHAR(255),
    Image NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Wishlists table for user-specific wishlists
CREATE TABLE Wishlists (
    WishlistID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    SareeID INT NOT NULL,
    AddedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SareeID) REFERENCES Sarees(SareeID) ON DELETE CASCADE,
    UNIQUE(UserID, SareeID)
);

