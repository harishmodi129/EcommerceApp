import { makeAutoObservable, runInAction } from "mobx";

const STORAGE_KEY = "shopapp_cart_v2";

class CartStore {
  items = [];

  constructor() {
    makeAutoObservable(this);
    this._hydrate();
  }

  _hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        runInAction(() => {
          this.items = JSON.parse(raw);
        });
      }
    } catch {
      runInAction(() => {
        this.items = [];
      });
    }
  }

  _persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {}
  }

  addItem(product) {
    const existing = this.items.find((i) => i.id === product.id);
    if (existing) {
      runInAction(() => {
        existing.quantity += 1;
      });
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: this._cleanImageUrl(product.images?.[0]),
        quantity: 1,
      });
    }
    this._persist();
  }

  get totalItems() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalPrice() {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  _cleanImageUrl(url) {
    if (!url) return "";
    return String(url).replace(/[\[\]"]/g, "");
  }
}

const cartStore = new CartStore();
export default cartStore;
