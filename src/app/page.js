"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
var getDictionary_1 = require("@/lib/getDictionary"); // Updated import
var getLocale_1 = require("@/lib/getLocale");
var link_1 = require("next/link");
var event_services_1 = require("@/services/event.services");
var locales_json_1 = require("./locales.json"); // Import the new locales.json
function Home() {
    return __awaiter(this, void 0, void 0, function () {
        var totalEvents, totalBibsSold, locale, dictionary, events, error_1, heroTitle, heroSubtitle, browseEventsButton, impactTitle, activeEventsText, bibsExchangedText, ctaTitle, ctaDescription, learnMoreButton;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        return __generator(this, function (_3) {
            switch (_3.label) {
                case 0:
                    totalEvents = 0;
                    totalBibsSold = 0;
                    return [4 /*yield*/, (0, getLocale_1.getLocale)()
                        // Get translations specifically for the home page using the new system
                    ];
                case 1:
                    locale = _3.sent();
                    dictionary = (0, getDictionary_1.getTranslationsFromData)(locale, locales_json_1.default);
                    _3.label = 2;
                case 2:
                    _3.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, event_services_1.fetchApprovedPublicEvents)()];
                case 3:
                    events = _3.sent();
                    totalEvents = events.length;
                    totalBibsSold = events.reduce(function (sum, event) { var _a; return sum + ((_a = event.bibsSold) !== null && _a !== void 0 ? _a : 0); }, 0);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _3.sent();
                    console.error('Failed to fetch event data for KPIs:', error_1);
                    return [3 /*break*/, 5];
                case 5:
                    heroTitle = (_c = (_b = (_a = dictionary.home) === null || _a === void 0 ? void 0 : _a.hero) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : 'Welcome!' // Fallback text
                    ;
                    heroSubtitle = (_f = (_e = (_d = dictionary.home) === null || _d === void 0 ? void 0 : _d.hero) === null || _e === void 0 ? void 0 : _e.subtitle) !== null && _f !== void 0 ? _f : 'Find your next race bib.';
                    browseEventsButton = (_j = (_h = (_g = dictionary.home) === null || _g === void 0 ? void 0 : _g.hero) === null || _h === void 0 ? void 0 : _h.browseEventsButton) !== null && _j !== void 0 ? _j : 'Browse Events';
                    impactTitle = (_m = (_l = (_k = dictionary.home) === null || _k === void 0 ? void 0 : _k.impact) === null || _l === void 0 ? void 0 : _l.title) !== null && _m !== void 0 ? _m : 'Our Impact';
                    activeEventsText = (_q = (_p = (_o = dictionary.home) === null || _o === void 0 ? void 0 : _o.impact) === null || _p === void 0 ? void 0 : _p.activeEvents) !== null && _q !== void 0 ? _q : 'Active Events';
                    bibsExchangedText = (_t = (_s = (_r = dictionary.home) === null || _r === void 0 ? void 0 : _r.impact) === null || _s === void 0 ? void 0 : _s.bibsExchanged) !== null && _t !== void 0 ? _t : 'Bibs Exchanged';
                    ctaTitle = (_w = (_v = (_u = dictionary.home) === null || _u === void 0 ? void 0 : _u.callToAction) === null || _v === void 0 ? void 0 : _v.title) !== null && _w !== void 0 ? _w : 'Get Started';
                    ctaDescription = (_z = (_y = (_x = dictionary.home) === null || _x === void 0 ? void 0 : _x.callToAction) === null || _y === void 0 ? void 0 : _y.description) !== null && _z !== void 0 ? _z : 'Learn more or browse events.';
                    learnMoreButton = (_2 = (_1 = (_0 = dictionary.home) === null || _0 === void 0 ? void 0 : _0.callToAction) === null || _1 === void 0 ? void 0 : _1.learnMoreButton) !== null && _2 !== void 0 ? _2 : 'Learn More';
                    return [2 /*return*/, (<div className="font-[family-name:var(--font-geist-sans)] text-[var(--text-dark)]">
			{/* Hero Section */}
			<section className="bg-[var(--primary-pastel)] px-4 py-16 text-center md:py-24">
				<h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{heroTitle}</h1>
				<p className="mb-8 text-lg text-white/90 md:text-xl">{heroSubtitle}</p>
				<link_1.default className="btn btn-primary px-8 py-3 text-lg" href="/events">
					{browseEventsButton}
				</link_1.default>
			</section>

			{/* KPIs Section - Bento Box Style */}
			<section className="px-4 py-12">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="mb-8 text-3xl font-bold text-[var(--text-dark)]">{impactTitle}</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* Bento Box for Active Events */}
						<div className="bento-box flex flex-col items-center justify-center text-center">
							<h3 className="mb-2 text-4xl font-bold text-[var(--accent-sporty)]">{totalEvents}</h3>
							<p className="text-xl text-[var(--text-dark)]">{activeEventsText}</p>
						</div>
						{/* Bento Box for Bibs Exchanged */}
						<div className="bento-box flex flex-col items-center justify-center text-center">
							<h3 className="mb-2 text-4xl font-bold text-[var(--accent-sporty)]">{totalBibsSold}</h3>
							<p className="text-xl text-[var(--text-dark)]">{bibsExchangedText}</p>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action / How it works (Simplified) */}
			<section className="bg-[var(--secondary-pastel)]/30 px-4 py-12">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="mb-4 text-3xl font-bold text-[var(--text-dark)]">{ctaTitle}</h2>
					<p className="mb-8 text-lg text-[var(--text-dark)]/80">{ctaDescription}</p>
					<div className="flex flex-col justify-center gap-4 md:flex-row">
						<link_1.default className="btn btn-secondary" href="/faq">
							{learnMoreButton}
						</link_1.default>
						{/* Future: Link to Sign Up or specific user roles */}
						{/* <Link href="/sign-up" className="btn btn-primary">
                  Get Started
                </Link> */}
					</div>
				</div>
			</section>

			{/* Original Next.js info section - can be kept for reference or removed */}
			{/*
                      <section className="p-8 pb-20 items-center justify-items-center bg-gray-100 dark:bg-gray-700">
                        <main className="flex flex-col gap-[32px] items-center sm:items-start max-w-2xl mx-auto">
                          <Image
                            className="dark:invert mx-auto"
                            src="/next.svg"
                            alt="Next.js logo"
                            width={180}
                            height={38}
                            priority
                          />
                          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                            <li className="mb-2 tracking-[-.01em]">
                              Get started by editing{" "}
                              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                                src/app/page.tsx
                              </code>
                            </li>
                            <li className="tracking-[-.01em]">
                              Save and see your changes instantly.
                            </li>
                          </ol>
                        </main>
                      </section>
                      */}
		</div>)];
            }
        });
    });
}
