import Lottie from "lottie-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: "default" | "minimal" | "pulse";
}

const loadingAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 120,
  h: 120,
  nm: "Loading Circle",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { 
          a: 1, 
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
            { t: 119, s: [360] }
          ]
        },
        p: { a: 0, k: [60, 60] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [50, 50] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0, 0.42, 0.68, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 6 },
              lc: 2,
              lj: 2,
              d: [{ n: "d", nm: "dash", v: { a: 0, k: 15 } }, { n: "g", nm: "gap", v: { a: 0, k: 15 } }]
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    }
  ]
};

export function LoadingOverlay({ isVisible, message = "Loading...", variant = "default" }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center space-y-6 shadow-2xl border border-border/50 max-w-sm mx-4">
        
        {variant === "default" && (
          <div className="w-20 h-20">
            <Lottie
              animationData={loadingAnimation}
              loop={true}
              autoplay={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}
        
        {variant === "minimal" && (
          <div className="w-16 h-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
          </div>
        )}
        
        {variant === "pulse" && (
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        )}
        
        <p className="text-foreground/80 text-center font-medium text-sm">{message}</p>
      </div>
    </div>
  );
}
