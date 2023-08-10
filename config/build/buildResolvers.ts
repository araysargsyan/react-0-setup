import {ResolveOptions} from "webpack";

export default function (): ResolveOptions {
   return {
       extensions: ['.tsx', '.ts', '.js'],
   }
}
