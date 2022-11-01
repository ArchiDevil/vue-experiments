import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";

if (!Element.prototype.scrollIntoViewIfNeeded) {
    Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded = true) {
        const el = this;
        new IntersectionObserver(function ([entry]) {
            const ratio = entry.intersectionRatio;
            if (ratio < 1) {
                let place = ratio <= 0 && centerIfNeeded ? 'center' : 'nearest';
                el.scrollIntoView({
                    block: place,
                    inline: place,
                });
            }
            this.disconnect();
        }).observe(this);
    };
}

let pinia = createPinia()
let app = createApp(App)

app.use(pinia)
app.mount('App')
