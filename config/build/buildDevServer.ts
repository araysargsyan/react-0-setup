import type {Configuration as DevServerConfiguration} from 'webpack-dev-server'

export default function (port: number): DevServerConfiguration {
    return {
        port,
        open: true,
        historyApiFallback: true
    }
}
