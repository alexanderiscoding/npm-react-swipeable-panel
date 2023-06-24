export default class Component {
    constructor(props: any);
    state: {
        panelHeight: number;
    };
    orientationChange: () => void;
    componentDidMount: () => void;
    componentDidUpdate(): void;
    render(): any;
}
