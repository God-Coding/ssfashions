// Wishlist utility functions for client-side storage

export interface WishlistItem {
    SareeID: number;
    Name: string;
    Price: number;
    ImageURL: string;
}

export function getWishlist(): WishlistItem[] {
    if (typeof window === 'undefined') return [];
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

export function addToWishlist(item: WishlistItem): void {
    const wishlist = getWishlist();
    const exists = wishlist.find(w => w.SareeID === item.SareeID);
    if (!exists) {
        wishlist.push(item);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

export function removeFromWishlist(sareeId: number): void {
    const wishlist = getWishlist();
    const filtered = wishlist.filter(w => w.SareeID !== sareeId);
    localStorage.setItem('wishlist', JSON.stringify(filtered));
}

export function isInWishlist(sareeId: number): boolean {
    const wishlist = getWishlist();
    return wishlist.some(w => w.SareeID === sareeId);
}
