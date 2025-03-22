-- @environment-functions
declare class Connection
    Fuunction: RBXScriptConnection
    State: Enum.ConnectionState
    Enable: () -> ()
    Disable: () -> ()
    Fire: (...any) -> ()
end

declare function getgenv(): { [any]: any }

declare function getrenv(): { [any]: any }

declare function getreg(): { [any]: any }

declare function getgc(include_tables: boolean?): { [any]: any }

declare function getinstances(): { [any]: Instance }

declare function getnilinstances(): { [any]: Instance }

declare function getscripts(): { [any]: LocalScript | ModuleScript }

declare function getloadedmodules(): { [any]: ModuleScript }

declare function getconnections(connection: RBXScriptSignal?): { [any]: Connection }

declare function firesignal(signal: RBXScriptSignal, ...: any): ()

declare function fireclickdetector(detector: ClickDetector, distance: number): ()

declare function fireproximityprompt(prompt: ProximityPrompt, distance: number): ()

declare function isnetworkowner(part: BasePart): boolean

declare function gethiddenproperty(object: Instance, property: string): any

declare function sethiddenproperty(object: Instance, property: string, value: any): ()

declare function setsimulationradius(radius: number, max_radius: number): ()


-- @script-functions
type Function = (...any) -> any 

declare function getsenv(script: LocalScript | ModuleScript): { [any]: any }

declare function getcallingscript(): LocalScript | ModuleScript | nil

declare function getscriptclosure(script: LocalScript | ModuleScript): Function

declare function getscripthash(script: LocalScript | ModuleScript): string


-- @table-functions
declare function getrawmetatable(table: { [any]: any }): { [any]: any }

declare function setrawmetatable(table: { [any]: any }, metatable: { [any]: any }): boolean

declare function setreadonly(table: { [any]: any }, readonly: boolean): ()

declare function isreadonly(table: { [any]: any }): boolean


-- @input-functions
declare function iswindowactive(): boolean

declare function keypress(key: number): ()

declare function keyrelease(key: number): ()

declare function mouse1click(): ()

declare function mouse1press(): ()

declare function mouse1release(): ()

declare function mouse2click(): ()

declare function mouse2press(): ()

declare function mouse2release(): ()

declare function mousescroll(pixel: number): ()

declare function mousemoverel(x: number, y: number): ()

declare function mousemoveabs(x: number, y: number): ()


-- @hook-functions
declare function hookfunction(old: Function, hook: Function): Function

declare function hookmetamethod(object: { [any]: any }, method: string, hook: Function): Function

declare function newcclosure(func: Function): Function


-- @reflection-functions
declare function checkcaller(): boolean

declare function islclosure(func: Function): boolean

declare function dumpstring(script: string): string

declare function decompile(target: LocalScript | ModuleScript | Function | string): string


-- @console-functions
declare function rconsoleprint(message: string): ()

declare function rconsoleinfo(message: string): ()

declare function rconsolewarn(message: string): ()

declare function rconsoleerr(message: string): ()

declare function rconsolename(name: string): ()

declare function rconsoleclear(): ()

declare function rconsoleinput(): string

declare function printconsole(message: string, red: number, green: number, blue: number): ()


-- @filesystem-functions
declare function readfile(path: string): string

declare function writefile(path: string, content: string): ()

declare function appendfile(path: string, content: string): ()

declare function loadfile(path: string): (Function | nil, string?)

declare function listfiles(path: string): { [any]: string }

declare function isfile(path: string): boolean

declare function isfolder(path: string): boolean

declare function makefolder(path: string): ()

declare function delfolder(path: string): ()

declare function delfile(path: string): ()


-- @misc-functions
declare function setclipboard(content: string): ()

declare function setfflag(fflag: string, value: string): ()

declare function getnamecallmethod(): string

declare function setnamecallmethod(method: string): ()

declare function getsynasset(asset: string): string

declare function getspecialinfo(obj: Instance): { [any]: any }

declare function saveinstance(opt: { mode: "optimized" | "full" | "scripts", noscript: boolean, scriptcache: boolean, timeout: number }?)

declare function messagebox(text: string, caption: string, flags: number): number